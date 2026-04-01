"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
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

    async function fetchProfile(userId: string) {
      try {
        const { data: profileData } = await supabaseBrowser
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();
        if (mounted) setProfile(profileData);
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    }

    // onAuthStateChange fires INITIAL_SESSION synchronously from local storage,
    // making it the fast, reliable path to resolve isLoading. This avoids the
    // infinite spinner caused by getUser() hanging on production cold starts
    // (getUser() hits the Supabase network endpoint to validate the JWT,
    // whereas the auth listener reads from local storage first).
    const { data: authListener } = supabaseBrowser.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === "INITIAL_SESSION") {
          const currentUser = session?.user ?? null;
          setUser(currentUser);
          if (currentUser) {
            await fetchProfile(currentUser.id);
          }
          // Always resolve isLoading on INITIAL_SESSION — this is the guaranteed
          // first event fired by Supabase, even before any network calls.
          if (mounted) setIsLoading(false);
        } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          const currentUser = session?.user ?? null;
          setUser(currentUser);
          if (currentUser) {
            await fetchProfile(currentUser.id);
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setProfile(null);
        }
      }
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

