"use client";

import { Bell, Menu, X, LayoutGrid, LogOut, User as UserIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useUser } from "../context/AuthContext";
import { supabaseBrowser } from "../lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, profile } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabaseBrowser.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 glass-panel-dark">
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
            <Link
              href="/history"
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              title="View your prompt history"
            >
              History
            </Link>
            <Link
              href="/settings"
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              title="Manage your account and preferences"
            >
              Settings
            </Link>
          </div>

          {/* User actions */}
          <div className="flex items-center gap-4 border-l border-white/10 pl-6">
            {user ? (
              <>
                <button
                  className="flex items-center justify-center size-9 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="size-5" />
                </button>

                <div className="flex items-center gap-3">
                  <Link
                    href="/settings/general"
                    className="flex items-center justify-center size-9 rounded-full border-2 border-white/10 overflow-hidden bg-slate-800 hover:border-cyan-500/50 transition-colors"
                  >
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="size-5 text-slate-400" />
                    )}
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="size-5" />
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
              >
                Log In
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="absolute top-16 left-0 right-0 glass-panel-dark border-t border-white/10 md:hidden animate-fadeIn">
            <div className="px-6 py-4 space-y-3">
              <Link
                href="/library"
                className="block px-4 py-3 text-sm font-medium text-white hover:text-cyan-400 transition-colors rounded-lg hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
                title="Browse your prompt library"
              >
                Library
              </Link>
              <Link
                href="/studio"
                className="block px-4 py-3 text-sm font-medium text-white hover:text-cyan-400 transition-colors rounded-lg hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
                title="Design and test new prompts"
              >
                Studio
              </Link>
              <Link
                href="/history"
                className="block px-4 py-3 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
                title="View your prompt history"
              >
                History
              </Link>
              <Link
                href="/settings"
                className="block px-4 py-3 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
                title="Manage your account and preferences"
              >
                Settings
              </Link>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                {user ? (
                  <>
                    <button
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-white"
                      aria-label="Notifications"
                    >
                      <Bell className="size-5" />
                      Notifications
                    </button>
                    <div className="flex items-center gap-3">
                      <Link
                        href="/settings/general"
                        className="size-8 rounded-full border-2 border-white/10 overflow-hidden bg-slate-800"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {profile?.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt="User"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserIcon className="size-4 text-slate-400 m-auto mt-1" />
                        )}
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="p-2 text-slate-400"
                      >
                        <LogOut className="size-5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="w-full bg-primary text-white text-center py-2 rounded-lg font-bold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Log In
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

