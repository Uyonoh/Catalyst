"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sparkles, ArrowRight, Zap, Target, Shield } from "lucide-react";

export default function LandingHero() {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt");
  const router = useRouter();

  const handleOptimize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    localStorage.setItem("catalyst_guest_input", prompt.trim());
    localStorage.setItem("catalyst_guest_model", selectedModel);
    router.push("/studio");
  };

  return (
    <section className="relative pt-10 pb-24 md:pt-20 md:pb-40 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[30%] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">

          {/* Main Title */}
          <h1 className="flex flex-col gap-2 items-center text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1] mb-6">
            <span>A free AI Prompt Generator</span>
            <span className="">Built for real results</span>
          </h1>

          {/* Subtitle */}
          <h2 className="text-base sm:text-2xl font-bold text-slate-300 tracking-tight leading-relaxed mb-10 max-w-2xl mx-auto">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Catalyst{" "}Prompt Studio
            </span>
          </h2>

          {/* Quick Start Input Box */}
          <div className="max-w-3xl mx-auto mb-16 px-1">
            <form
              onSubmit={handleOptimize}
              className="glass-panel border border-white/10 p-4 sm:p-5 rounded-3xl shadow-2xl relative group hover:border-cyan-500/20 transition-all duration-300 text-left"
            >
              {/* Outer neon border glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10 pointer-events-none" />

              <div className="flex flex-col gap-4">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Paste your raw prompt idea here to optimize it..."
                  className="w-full min-h-[50px] sm:min-h-[50px] bg-transparent text-white placeholder-slate-500 focus:outline-none text-base resize-none border-b border-white/5 pb-2 scrollbar-none"
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Model Selector Label/Pills */}
                  <div className="flex flex-col gap-2 items-start w-full sm:w-auto">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      Target Model
                    </span>
                    {/* Horizontal scrollable pills on mobile */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none w-full sm:w-auto">
                      {[
                        { slug: "gpt", name: "GPT" },
                        { slug: "claude", name: "Claude" },
                        { slug: "gemini", name: "Gemini" },
                        { slug: "llama", name: "Llama" },
                        { slug: "midjourney", name: "Midjourney" },
                      ].map((m) => (
                        <button
                          key={m.slug}
                          type="button"
                          onClick={() => setSelectedModel(m.slug)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all shrink-0 cursor-pointer ${
                            selectedModel === m.slug
                              ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                              : "bg-white/[0.02] border-white/5 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          {m.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!prompt.trim()}
                    className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm transition-all duration-300 w-full sm:w-auto ${
                      prompt.trim()
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer animate-pulse-glow"
                        : "bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed"
                    }`}
                  >
                    <span>Optimize in Studio</span>
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Alternative standard account links */}
          <div className="flex flex-row items-center justify-center gap-6 mb-20 text-sm">
            <Link
              href="/studio"
              className="text-slate-400 hover:text-cyan-400 transition-colors"
            >
              Open Studio directly
            </Link>
            <span className="text-slate-700 font-bold">•</span>
            <Link
              href="/login?next=/settings"
              className="text-slate-400 hover:text-cyan-400 transition-colors"
            >
              Manage account
            </Link>
          </div>

          {/* Features Grid - Minimalist */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-left hover:border-cyan-500/30 transition-colors group">
              <div className="size-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                <Zap className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Live Analysis
              </h3>
              <p className="text-slate-400 text-sm">
                Real-time feedback on prompt quality, token count, and
                performance potential.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-left hover:border-purple-500/30 transition-colors group">
              <div className="size-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                <Target className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Model Optimized
              </h3>
              <p className="text-slate-400 text-sm">
                Tailor your prompts for ChatGPT, Claude, or Gemini with
                platform-specific insights.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-left hover:border-blue-500/30 transition-colors group">
              <div className="size-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                <Shield className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Library Management
              </h3>
              <p className="text-slate-400 text-sm">
                Securely store, version, and organize your prompts in a
                professional catalog.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Gradient Line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
