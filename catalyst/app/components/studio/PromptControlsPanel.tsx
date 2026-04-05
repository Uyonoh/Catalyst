"use client";

import React from "react";
import { useWorkspace } from "../../context/WorkspaceContext";
import { SlidersHorizontal, Target, Type, Workflow, ShieldAlert } from "lucide-react";

export default function PromptControlsPanel() {
  const { controls, setControls } = useWorkspace();

  return (
    <div className="flex flex-col gap-6 p-4 rounded-xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 mb-2">
        <SlidersHorizontal className="size-4 text-cyan-400" />
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Refinement Controls</h3>
      </div>

      {/* Creativity Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-slate-400 flex items-center gap-2">
            <span className="p-1 rounded bg-purple-500/10 text-purple-400">
              <Type className="size-3" />
            </span>
            Creativity
          </label>
          <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded leading-none">
            {controls.creativity?.toFixed(1)}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={controls.creativity}
          onChange={(e) => setControls({ creativity: parseFloat(e.target.value) })}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
        <div className="flex justify-between text-[9px] text-slate-500 font-medium uppercase tracking-tighter">
          <span>Literal</span>
          <span>Balanced</span>
          <span>Expansive</span>
        </div>
      </div>

      {/* Precision Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-slate-400 flex items-center gap-2">
            <span className="p-1 rounded bg-blue-500/10 text-blue-400">
              <Target className="size-3" />
            </span>
            Precision
          </label>
          <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded leading-none">
            {controls.precision?.toFixed(1)}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={controls.precision}
          onChange={(e) => setControls({ precision: parseFloat(e.target.value) })}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-[9px] text-slate-500 font-medium uppercase tracking-tighter">
          <span>Flexible</span>
          <span>Detailed</span>
          <span>Unambiguous</span>
        </div>
      </div>

      {/* Length Toggle */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-400 flex items-center gap-2">
          <span className="p-1 rounded bg-emerald-500/10 text-emerald-400">
             <Type className="size-3" />
          </span>
          Output Length
        </label>
        <div className="grid grid-cols-3 gap-2">
          {["short", "medium", "long"].map((l) => (
            <button
              key={l}
              onClick={() => setControls({ length: l as any })}
              className={`py-1.5 text-[10px] font-bold rounded-md border transition-all uppercase tracking-wider ${
                controls.length === l
                  ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                  : "bg-slate-900/50 border-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/5"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Strategy Selector */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-400 flex items-center gap-2">
          <span className="p-1 rounded bg-cyan-500/10 text-cyan-400">
            <Workflow className="size-3" />
          </span>
          Reasoning Strategy
        </label>
        <div className="flex flex-col gap-2">
          {[
            { id: "default", label: "Standard Refinement", desc: "Fast & direct optimization" },
            { id: "chain_of_thought", label: "Chain of Thought", desc: "Explains logic before output" },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setControls({ strategy: s.id as any })}
              className={`flex flex-col items-start p-2.5 rounded-lg border transition-all text-left ${
                controls.strategy === s.id
                  ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                  : "bg-slate-900/50 border-white/5 text-slate-400 hover:bg-white/5"
              }`}
            >
              <span className="text-[11px] font-bold">{s.label}</span>
              <span className="text-[9px] opacity-60 font-medium">{s.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Robustness Toggle */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-orange-500/5 border border-orange-500/10">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-4 text-orange-400" />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-orange-400">Robust Failure Handling</span>
            <span className="text-[9px] text-orange-400/60 font-medium">Auto-resolve intent ambiguity</span>
          </div>
        </div>
        <button
           onClick={() => setControls({ failureHandling: !controls.failureHandling })}
           className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${controls.failureHandling ? "bg-orange-500" : "bg-slate-700"}`}
        >
          <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${controls.failureHandling ? "translate-x-5" : "translate-x-1"}`} />
        </button>
      </div>
    </div>
  );
}
