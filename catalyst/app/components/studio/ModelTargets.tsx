"use client";

import { useState } from "react";
import GlassPanel from "../GlassPanel";
import { LayoutGrid, Zap } from "lucide-react";

const MODELS = [
  { id: "midjourney", name: "Midjourney v6", type: "Img", checked: true },
  { id: "claude", name: "Claude 3 Opus", type: "Txt", checked: false },
  { id: "gpt", name: "GPT-4 Turbo", type: "Txt", checked: false },
  { id: "llama", name: "Llama 3", type: "Txt", checked: false },
];

export default function ModelTargets() {
  const [selectedModel, setSelectedModel] = useState("midjourney");

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <LayoutGrid className="size-6 text-cyan-400" />
          Model Targets
        </h2>
      </div>

      <GlassPanel className="rounded-xl p-4 flex flex-col gap-4 h-full">
        <div
          className="flex flex-col gap-2 overflow-y-auto pr-2"
          style={{ maxHeight: "240px" }}
        >
          {MODELS.map((model) => (
            <label
              key={model.id}
              className={`relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${selectedModel === model.id ? "border-cyan-500/50 bg-cyan-500/10 hover:bg-cyan-500/20" : "border-transparent bg-white/5 hover:bg-white/10 hover:border-white/10"}`}
            >
              <input
                type="radio"
                name="model"
                checked={selectedModel === model.id}
                onChange={() => setSelectedModel(model.id)}
                className="w-4 h-4 text-cyan-500 bg-transparent border-slate-500 focus:ring-cyan-500 focus:ring-offset-0"
              />
              <span className="text-white font-bold text-sm">{model.name}</span>
              <span
                className={`ml-auto text-xs px-2 py-0.5 rounded ${selectedModel === model.id ? "text-cyan-200 bg-cyan-900/40" : "text-slate-400 bg-slate-800/40"}`}
              >
                {model.type}
              </span>
            </label>
          ))}
        </div>

        {/* Tokens Usage */}
        <div className="mt-auto pt-4 border-t border-white/10">
          <div className="bg-gradient-to-br from-[#1b2127] to-[#101922] p-3 rounded-lg border border-white/5">
            <div className="flex items-center gap-2 mb-2 text-slate-300 text-xs font-medium">
              <Zap className="size-4" />
              <span>Tokens Used</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2">
              <div className="bg-cyan-500 h-1.5 rounded-full w-[45%] shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>450 / 1000</span>
              <span>Resets in 2d</span>
            </div>
          </div>
        </div>
      </GlassPanel>
    </>
  );
}
