"use client";

import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GlassPanel from "../components/GlassPanel";
import { Info, Target, Users, ShieldCheck, Mail, MessageSquare, Phone, MapPin } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full max-w-[1200px] mx-auto pt-16 pb-12 px-4 md:px-8 relative z-10">
        <div className="flex flex-col gap-12">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
              About <span className="text-cyan-400">Catalyst Prompt Studio</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              We are on a mission to bridge the gap between human creativity and AI potential through precision engineering.
            </p>
          </div>

          {/* Core Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassPanel className="p-8 flex flex-col gap-4" hoverable gradientBorder>
              <div className="size-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <Target className="size-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Precision</h3>
              <p className="text-slate-400 leading-relaxed">
                Our tools are designed for professionals who demand exact results. We eliminate the guesswork from prompt engineering.
              </p>
            </GlassPanel>

            <GlassPanel className="p-8 flex flex-col gap-4" hoverable gradientBorder>
              <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Sparkles className="size-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </div>
              <h3 className="text-xl font-bold text-white">Innovation</h3>
              <p className="text-slate-400 leading-relaxed">
                We stay at the bleeding edge of AI developments, ensuring our users always have access to the latest optimization techniques.
              </p>
            </GlassPanel>

            <GlassPanel className="p-8 flex flex-col gap-4" hoverable gradientBorder>
              <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Users className="size-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Community</h3>
              <p className="text-slate-400 leading-relaxed">
                Built for creators, by creators. Our platform fosters a shared ecosystem of knowledge and high-quality prompt benchmarks.
              </p>
            </GlassPanel>
          </div>

          {/* The Story */}
          <GlassPanel className="p-8 md:p-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 size-64 bg-cyan-500/5 rounded-full blur-[80px] -mr-32 -mt-32" />
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-black text-white">Our Story</h2>
                <p className="text-slate-400 leading-relaxed">
                  Catalyst began as a small internal tool for a group of AI researchers who were tired of inconsistent model outputs. They realized that the "magic" of AI was often just a matter of how questions were framed.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  In 2024, we decided to open Catalyst to the world, transforming it into a full-scale studio that empowers anyone to write prompts like a researcher. Today, thousands of developers and creatives use Catalyst to power their vision.
                </p>
              </div>
              <div className="relative aspect-video rounded-2xl border border-white/10 overflow-hidden bg-slate-900 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-primary/20 flex items-center justify-center">
                   <LayoutGrid className="size-20 text-white/20" />
                </div>
              </div>
            </div>
          </GlassPanel>
        </div>
      </main>
      <Footer />
    </>
  );
}

const Sparkles = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);

const LayoutGrid = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="7" height="7" x="3" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="14" rx="1" />
    <rect width="7" height="7" x="3" y="14" rx="1" />
  </svg>
);
