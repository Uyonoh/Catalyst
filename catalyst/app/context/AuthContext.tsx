"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User } from "@supabase/supabase-js";
import { supabaseBrowser } from "../lib/supabase-browser";

interface AuthContextType {
  user: User | null;
  profile: any | null; // Replace any with Profile type if available
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Fetch profile in the background — never blocks auth resolution.
    // Uses a 5s timeout to guard against Supabase cold-start query hangs
    // (the root cause of the infinite spinner: the DB query silently never
    // resolves/rejects when called immediately after SIGNED_IN fires).
    function fetchProfileBackground(userId: string) {
      const timeout = new Promise<void>((_, reject) =>
        setTimeout(() => reject(new Error("fetchProfile timeout")), 5000)
      );
      const query = supabaseBrowser
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()
        .then(({ data: profileData }) => {
          if (mounted) setProfile(profileData);
        });

      Promise.race([query, timeout]).catch((err) => {
        console.warn("fetchProfile failed or timed out:", err.message);
      });
    }

    const { data: authListener } = supabaseBrowser.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;

        if (event === "INITIAL_SESSION") {
          const currentUser = session?.user ?? null;
          setUser(currentUser);
          // Resolve loading immediately — don't wait on the DB query.
          if (mounted) setIsLoading(false);
          // Fetch profile in background after loading resolves.
          if (currentUser) fetchProfileBackground(currentUser.id);

        } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          const currentUser = session?.user ?? null;
          setUser(currentUser);
          // Critical: resolve loading BEFORE fetching profile.
          // Previously, awaiting fetchProfile here caused isLoading to
          // stay true indefinitely when the DB query hung on cold starts.
          if (mounted) setIsLoading(false);
          if (currentUser) fetchProfileBackground(currentUser.id);

        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setProfile(null);
          if (mounted) setIsLoading(false);
        }
      },
    );

    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabaseBrowser.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useUser must be used within an AuthProvider");
  }
  return context;
};
