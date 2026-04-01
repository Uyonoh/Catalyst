"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@supabase/supabase-js";
import { supabaseBrowser } from "../lib/supabase-browser";

interface AuthContextType {
  user: User | null;
  profile: any | null; // Replace any with Profile type if available
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function getUser() {
      try {
        const { data: { user } } = await supabaseBrowser.auth.getUser();
        if (mounted) {
          setUser(user);
          if (user) {
             const { data: profileData } = await supabaseBrowser.from('profiles').select('*').eq('id', user.id).single();
             if (mounted) setProfile(profileData);
          }
        }
      } catch (err) {
        console.error("Error fetching user data", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    getUser();

    const { data: authListener } = supabaseBrowser.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
           const currentUser = session?.user ?? null;
           setUser(currentUser);
           if (currentUser) {
              const { data: profileData } = await supabaseBrowser.from('profiles').select('*').eq('id', currentUser.id).single();
              setProfile(profileData);
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

  return (
    <AuthContext.Provider value={{ user, profile, isLoading }}>
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
