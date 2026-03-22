"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 glass-panel-dark">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="size-8 flex items-center justify-center text-cyan-400">
            <span className="material-symbols-outlined !text-[28px] sm:!text-[32px]">
              auto_awesome_mosaic
            </span>
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
          <span className="material-symbols-outlined">
            {isMobileMenuOpen ? "close" : "menu"}
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-1">
            <Link
              href="/vault"
              className="px-4 py-2 text-sm font-medium text-white hover:text-cyan-300 transition-colors rounded-lg hover:bg-white/5"
            >
              Prompt Library
            </Link>
            <Link
              href="/workspace"
              className="px-4 py-2 text-sm font-medium text-white hover:text-cyan-400 transition-colors rounded-lg hover:bg-white/5"
            >
              Generate Prompts
            </Link>
            <Link
              href="#"
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              History
            </Link>
            <Link
              href="#"
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              Settings
            </Link>
          </div>

          {/* User actions */}
          <div className="flex items-center gap-4 border-l border-white/10 pl-6">
            <button
              className="flex items-center justify-center size-9 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              aria-label="Notifications"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "20px" }}
              >
                notifications
              </span>
            </button>

            <div
              className="bg-center bg-no-repeat bg-cover rounded-full size-9 ring-2 ring-white/10 cursor-pointer"
              aria-label="User profile avatar showing a smiling person"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA3g60JcD1O-zBbO1tv5aAO4luRtDDqXP0KVD03-sHIPWu0es_7MBZLIiTZKwJMRbY7uKc3GL_Rd2PWM_HYCZ8fFWvsjw7PFuFOvC6RGggy3x_TJ3191rRUx-gb_lbOPfvDd743xt5quIRn1zo7w8ct1914-i-eKbccHntDKYAD3m0ANNYFp73PEPlReRAq7GujQWJkwkGCN_MSef3JLE6S8pYxDLpflaXDzN2qtnS0gQhbcI0QIwdozgQhXK8kpOHsIHuhIXWf4K4")',
              }}
            />
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="absolute top-16 left-0 right-0 glass-panel-dark border-t border-white/10 md:hidden animate-fadeIn">
            <div className="px-6 py-4 space-y-3">
              <Link
                href="/vault"
                className="block px-4 py-3 text-sm font-medium text-white hover:text-cyan-400 transition-colors rounded-lg hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Vault
              </Link>
              <Link
                href="/workspace"
                className="block px-4 py-3 text-sm font-medium text-white hover:text-cyan-400 transition-colors rounded-lg hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Workspace
              </Link>
              <Link
                href="#"
                className="block px-4 py-3 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                History
              </Link>
              <Link
                href="#"
                className="block px-4 py-3 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Settings
              </Link>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <button
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-white"
                  aria-label="Notifications"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    notifications
                  </span>
                  Notifications
                </button>
                <div
                  className="bg-center bg-no-repeat bg-cover rounded-full size-8 ring-2 ring-white/10 cursor-pointer"
                  aria-label="User profile avatar"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA3g60JcD1O-zBbO1tv5aAO4luRtDDqXP0KVD03-sHIPWu0es_7MBZLIiTZKwJMRbY7uKc3GL_Rd2PWM_HYCZ8fFWvsjw7PFuFOvC6RGggy3x_TJ3191rRUx-gb_lbOPfvDd743xt5quIRn1zo7w8ct1914-i-eKbccHntDKYAD3m0ANNYFp73PEPlReRAq7GujQWJkwkGCN_MSef3JLE6S8pYxDLpflaXDzN2qtnS0gQhbcI0QIwdozgQhXK8kpOHsIHuhIXWf4K4")',
                  }}
                />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
