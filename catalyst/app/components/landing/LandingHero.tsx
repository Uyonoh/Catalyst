"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Zap, Target, Shield } from "lucide-react";

export default function LandingHero() {
  return (
    <section className="relative pt-20 pb-24 md:pt-32 md:pb-40 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[30%] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in">
            <Sparkles className="size-3" />
            <span>Next-Gen Prompt Engineering</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.1] mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50">
            Design Prompts <br /> 
            <span className="text-cyan-400">With Purpose.</span>
          </h1>

          {/* Description */}
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed mb-12">
            The professional studio for crafting, testing, and managing high-performance AI prompts. Transform raw ideas into consistent results.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link
              href="/dashboard"
              className="group relative flex items-center gap-2 bg-white text-slate-950 px-8 py-4 rounded-2xl font-black text-lg hover:bg-cyan-400 hover:text-slate-950 transition-all duration-300 shadow-xl shadow-white/5"
            >
              Get Started Free
              <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/studio"
              className="px-8 py-4 rounded-2xl font-bold text-lg text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              Open Studio
            </Link>
          </div>

          {/* Features Grid - Minimalist */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-left hover:border-cyan-500/30 transition-colors group">
              <div className="size-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                <Zap className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Live Analysis</h3>
              <p className="text-slate-400 text-sm">Real-time feedback on prompt quality, token count, and performance potential.</p>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-left hover:border-purple-500/30 transition-colors group">
              <div className="size-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                <Target className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Model Optimized</h3>
              <p className="text-slate-400 text-sm">Tailor your prompts for GPT-4, Claude 3, or Gemini with platform-specific insights.</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-left hover:border-blue-500/30 transition-colors group">
              <div className="size-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                <Shield className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Library Management</h3>
              <p className="text-slate-400 text-sm">Securely store, version, and organize your prompts in a professional catalog.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Gradient Line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
