"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { User } from "@supabase/supabase-js";
import { supabaseBrowser } from "../lib/supabase-browser";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: 'free' | 'basic' | 'plus' | 'pro' | 'ultra';
  daily_tokens_used: number;
  tokens_reset_at: string;
  bonus_tokens?: number;
  preferences: Record<string, unknown>;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfileBackground = useCallback((userId: string) => {
    const timeout = new Promise<void>((_, reject) =>
      setTimeout(() => reject(new Error("fetchProfile timeout")), 5000)
    );
    const query = supabaseBrowser
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()
      .then(({ data: profileData }) => {
        setProfile(profileData as Profile);
      });

    Promise.race([query, timeout]).catch((err) => {
      console.warn("fetchProfile failed or timed out:", err.message);
    });
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      fetchProfileBackground(user.id);
    }
  }, [user, fetchProfileBackground]);

  useEffect(() => {
    let mounted = true;

    const { data: authListener } = supabaseBrowser.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;

        if (event === "INITIAL_SESSION") {
          const currentUser = session?.user ?? null;
          setUser(currentUser);
          if (mounted) setIsLoading(false);
          if (currentUser) fetchProfileBackground(currentUser.id);

        } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          const currentUser = session?.user ?? null;
          setUser(currentUser);
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
  }, [fetchProfileBackground]);

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
    <AuthContext.Provider value={{ user, profile, isLoading, signOut, refreshProfile }}>
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

