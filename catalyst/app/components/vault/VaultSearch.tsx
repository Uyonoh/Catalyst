import React from "react";

export default function VaultSearch() {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      {/* Search */}
      <div className="flex-1 group">
        <div className="flex w-full items-center rounded-xl h-12 glass-panel border border-white/10 overflow-hidden px-4 transition-all duration-300 focus-within:border-cyan-500/50 focus-within:shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          <span className="material-symbols-outlined text-cyan-400 mr-3">
            search
          </span>
          <input
            className="w-full bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 text-base focus:outline-none"
            placeholder="Search prompts by keyword, model, or snippet..."
            type="text"
          />
          <div className="hidden sm:flex text-xs text-slate-500 border border-white/10 rounded px-2 py-0.5">
            ⌘K
          </div>
        </div>
      </div>
      {/* Sort/View Options */}
      <div className="flex gap-2 shrink-0">
        <button className="h-12 px-4 rounded-xl glass-panel text-white hover:bg-white/10 border border-white/10 flex items-center gap-2 transition-colors active:scale-95">
          <span className="material-symbols-outlined text-[20px]">
            filter_list
          </span>
          <span className="text-sm font-medium">Filter</span>
        </button>
        <button className="h-12 w-12 rounded-xl bg-gradient-to-r from-cyan-500 to-primary text-white flex items-center justify-center hover:opacity-90 transition-colors shadow-neon active:scale-95">
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>
    </div>
  );
}
