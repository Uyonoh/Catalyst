"use client";

import {
  Bell,
  Menu,
  X,
  LayoutGrid,
  LogOut,
  User as UserIcon,
  Library,
  Sparkles,
  History as HistoryIcon,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useUser } from "../context/AuthContext";
import { supabaseBrowser } from "../lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <header className={`sticky top-0 z-50 w-full border-b border-white/10 glass-panel-dark transition-colors duration-300 ${isMobileMenuOpen ? '!bg-[#101922]' : ''}`}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="size-8 flex items-center justify-center text-cyan-400">
            <LayoutGrid className="size-7 sm:size-8" />
          </div>
          <h2 className="text-white text-lg sm:text-xl font-black tracking-tight">
            Catalyst
          </h2>
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex items-center justify-center size-9 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-1">
            <Link
              href="/library"
              className="px-4 py-2 text-sm font-medium text-white hover:text-cyan-300 transition-colors rounded-lg hover:bg-white/5"
              title="Browse your prompt library"
            >
              Library
            </Link>
            <Link
              href="/studio"
              className="px-4 py-2 text-sm font-medium text-white hover:text-cyan-400 transition-colors rounded-lg hover:bg-white/5"
              title="Design and test new prompts"
            >
              Studio
            </Link>
            {user && (
              <Link
                href="/history"
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                title="View your prompt history"
              >
                History
              </Link>
            )}
          </div>

          {/* User actions */}
          <div className="flex items-center gap-3 border-l border-white/10 pl-6">
            {user ? (
              <>
                <button
                  className="flex items-center justify-center size-9 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-all duration-300 group"
                  aria-label="Notifications"
                >
                  <Bell className="size-5 group-hover:scale-110 transition-transform" />
                </button>

                <div className="flex items-center gap-2 px-2 py-1.5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors">
                  <Link
                    href="/settings/general"
                    className="flex items-center justify-center size-8 rounded-full border border-white/20 overflow-hidden bg-slate-800 hover:border-cyan-500/50 transition-all duration-300"
                    title="Account Settings"
                  >
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="size-4 text-slate-400" />
                    )}
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="p-1.5 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                    title="Sign Out"
                  >
                    <LogOut className="size-4" />
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="relative overflow-hidden bg-primary px-6 py-2 rounded-xl text-sm font-bold text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 active:translate-y-0"
              >
                <span className="relative z-10">Log In</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full hover:animate-[shimmer_1.5s_infinite]" />
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="absolute top-16 left-0 right-0 bg-[#101922] border-t border-white/10 md:hidden animate-slideDown overflow-hidden">
            <div className="px-6 py-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/library"
                  className="flex flex-col gap-3 p-5 text-sm font-bold text-white hover:text-cyan-400 transition-all rounded-3xl bg-white/5 border border-white/5 hover:border-cyan-500/30 group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="size-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    <Library className="size-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black mb-1">
                      Workspace
                    </span>
                    <span className="text-base">Library</span>
                  </div>
                </Link>
                <Link
                  href="/studio"
                  className="flex flex-col gap-3 p-5 text-sm font-bold text-white hover:text-cyan-400 transition-all rounded-3xl bg-white/5 border border-white/5 hover:border-cyan-500/30 group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="size-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                    <Sparkles className="size-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black mb-1">
                      Creator
                    </span>
                    <span className="text-base">Studio</span>
                  </div>
                </Link>
              </div>

              {user && (
                <Link
                  href="/history"
                  className="flex items-center gap-3 px-5 py-4 text-sm font-bold text-slate-300 hover:text-white transition-colors rounded-2xl bg-white/5 border border-transparent hover:border-white/10 group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <HistoryIcon className="size-5 text-slate-500 group-hover:text-white transition-colors" />
                  History
                </Link>
              )}

              <div className="pt-6 border-t border-white/10">
                {user ? (
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full border-2 border-cyan-500/30 overflow-hidden bg-slate-800">
                          {profile?.avatar_url ? (
                            <img
                              src={profile.avatar_url}
                              alt="User"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <UserIcon className="size-5 text-slate-400 m-auto mt-2" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white leading-tight">
                            {profile?.full_name || "User Profile"}
                          </p>
                          <p className="text-xs text-slate-500">
                            Active Account
                          </p>
                        </div>
                      </div>
                      <button
                        className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
                        aria-label="Notifications"
                      >
                        <Bell className="size-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/settings/general"
                        className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-red-400 bg-red-500/5 hover:bg-red-500/10 rounded-xl transition-all border border-red-500/10"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center justify-center w-full bg-primary text-white text-center py-4 rounded-2xl font-black tracking-wide shadow-lg shadow-primary/20"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
