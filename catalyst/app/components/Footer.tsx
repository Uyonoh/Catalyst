"use client";

import React from "react";
import Link from "next/link";
import { Globe, Code, Twitter, LayoutGrid } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-8 md:mt-16 w-full border-t border-white/10 glass-panel-dark overflow-hidden transition-all duration-300">
      {/* Subtle glow background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-32 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-8">
          {/* Brand section */}
          <div className="flex flex-col gap-5 max-w-sm">
            <div className="flex items-center gap-3">
              <div className="size-8 flex items-center justify-center text-cyan-400">
                <LayoutGrid className="size-7" />
              </div>
              <h2 className="text-white text-xl font-black tracking-tight">
                Catalyst
              </h2>
            </div>
            <p className="text-slate-400 text-sm md:text-[15px] leading-relaxed">
              Empowering creatives and professionals with precision prompt
              engineering. Optimize, analyze, and refine your AI interactions in
              the Catalyst Studio.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <SocialIcon icon={<Globe className="size-5" />} label="Website" />
              <SocialIcon icon={<Code className="size-5" />} label="GitHub" />
              <SocialIcon icon={<Twitter className="size-5" />} label="Twitter" />
            </div>
          </div>

          {/* Links sections */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 md:gap-16 lg:gap-24 w-full lg:w-auto">
            <FooterGroup title="Product">
              <FooterLink href="/studio">Studio</FooterLink>
              <FooterLink href="/library">Library</FooterLink>
              <FooterLink href="/history">History</FooterLink>
              <FooterLink href="/settings">Settings</FooterLink>
            </FooterGroup>

            <FooterGroup title="Resources">
              <FooterLink href="#">Documentation</FooterLink>
              <FooterLink href="#">Prompt Guide</FooterLink>
              <FooterLink href="#">API Docs</FooterLink>
              <FooterLink href="/contact">Support</FooterLink>
            </FooterGroup>

            <FooterGroup title="Company">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Use</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
            </FooterGroup>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <p className="text-slate-500 text-sm">
              © {currentYear} Catalyst Studio.
            </p>
            <span className="hidden sm:inline text-slate-700 font-bold">•</span>
            <p className="text-slate-500 text-sm">Crafted for excellence.</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <p className="text-slate-500 text-xs font-medium tracking-wider">
                VERSION
              </p>
              <p className="text-slate-200 text-xs font-bold">1.2.4</p>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)] animate-pulse" />
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest translate-y-[0.5px]">
                Systems Online
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterGroup = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-6">
    <h3 className="text-white text-xs font-bold uppercase tracking-[0.2em]">
      {title}
    </h3>
    <ul className="flex flex-col gap-4">{children}</ul>
  </div>
);

const FooterLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <li>
    <Link
      href={href}
      className="text-slate-400 hover:text-cyan-400 text-sm md:text-[15px] transition-colors duration-200"
    >
      {children}
    </Link>
  </li>
);

const SocialIcon = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <button
    className="size-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-300 group"
    aria-label={label}
  >
    <div className="transition-transform group-hover:scale-110">
      {icon}
    </div>
  </button>
);

export default Footer;
