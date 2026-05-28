"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCatalog } from "../../context/CatalogContext";
import { Sparkles, ArrowRight, CornerDownLeft, Bot, MessageSquare } from "lucide-react";

export default function InteractiveActionHub() {
  const router = useRouter();
  const { models } = useCatalog();
  const [inputText, setInputText] = useState("");
  const [selectedModelSlug, setSelectedModelSlug] = useState("gpt");

  const activeModel = models.find((m) => m.slug === selectedModelSlug) || models[0];

  // Static model color definitions matching DESIGN.md
  const colorMap: Record<string, string> = {
    green: "border-emerald-500/30 focus-within:border-emerald-500 bg-emerald-500/10 text-emerald-400 focus-within:ring-emerald-500/20",
    purple: "border-purple-500/30 focus-within:border-purple-500 bg-purple-500/10 text-purple-400 focus-within:ring-purple-500/20",
    cyan: "border-cyan-500/30 focus-within:border-cyan-500 bg-cyan-500/10 text-cyan-400 focus-within:ring-cyan-500/20",
    orange: "border-orange-500/30 focus-within:border-orange-500 bg-orange-500/10 text-orange-400 focus-within:ring-orange-500/20",
    pink: "border-pink-500/30 focus-within:border-pink-500 bg-pink-500/10 text-pink-400 focus-within:ring-pink-500/20",
    blue: "border-blue-500/30 focus-within:border-blue-500 bg-blue-500/10 text-blue-400 focus-within:ring-blue-500/20",
    yellow: "border-yellow-500/30 focus-within:border-yellow-500 bg-yellow-500/10 text-yellow-400 focus-within:ring-yellow-500/20",
    rose: "border-rose-500/30 focus-within:border-rose-500 bg-rose-500/10 text-rose-400 focus-within:ring-rose-500/20",
  };

  const handleLaunchStudio = () => {
    if (!inputText.trim()) return;

    // Secure input cleaning to prevent script injection
    const cleanText = inputText
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
      .replace(/<\/?[^>]+(>|$)/g, "");

    // Hydrate to Studio page state
    localStorage.setItem("catalyst_guest_input", cleanText);
    router.push("/studio");
  };

  const activeColorToken = activeModel ? colorMap[activeModel.color] : colorMap.green;

  return (
    <div className="glass-panel rounded-2xl p-6 mb-8 relative border border-white/5 shadow-xl animate-fadeIn z-10">
      {/* Visual Accent Glow */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 to-[--color-primary]" />

      <div className="flex items-center gap-2 mb-4">
        <div className="size-8 rounded-lg bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
          <Sparkles className="size-4 animate-pulse" />
        </div>
        <div>
          <h3 className="text-white font-bold text-base leading-tight">Instant Prompt Sandbox</h3>
          <p className="text-slate-400 text-xs mt-0.5">Quick-draft your neural designs and send to the optimizer</p>
        </div>
      </div>

      {/* Main Textarea Container */}
      <div className={`relative flex flex-col rounded-xl border bg-black/30 transition-all duration-300 ${activeColorToken.split(" ")[0]} ${activeColorToken.split(" ").slice(1).join(" ")} focus-within:ring-2`}>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="E.g., Design a high-conversion newsletter copy for an AI coding tool focusing on engineers..."
          className="w-full min-h-[90px] max-h-[160px] bg-transparent text-white placeholder-slate-500 text-sm p-4 outline-none border-none resize-none overflow-y-auto"
          maxLength={1000}
        />

        {/* Action Tray */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 pt-0 border-t border-white/5 relative z-20">
          {/* Model Selector Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Target Model:</span>
            <div className="relative">
              <select
                value={selectedModelSlug}
                onChange={(e) => setSelectedModelSlug(e.target.value)}
                className="bg-white/5 border border-white/10 hover:border-white/20 text-white text-xs font-bold py-1 px-3.5 pr-8 rounded-lg outline-none cursor-pointer appearance-none transition-colors"
              >
                {models.map((model) => (
                  <option key={model.slug} value={model.slug} className="bg-[#101922] text-white">
                    {model.brief}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <CornerDownLeft className="size-3" />
              </div>
            </div>
          </div>

          {/* Character Count & Submit */}
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-slate-500 font-mono">
              {inputText.length}/1000
            </span>
            <button
              onClick={handleLaunchStudio}
              disabled={!inputText.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[--color-primary] to-cyan-500 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-lg disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 active:scale-95 group"
            >
              Draft in Studio
              <ArrowRight className="size-3.5 transform group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
