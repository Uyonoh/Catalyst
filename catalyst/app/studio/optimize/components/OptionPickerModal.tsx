"use client";

import React, { useState } from "react";
import { X, Search } from "lucide-react";

export interface OptionItem {
  id: string;
  name: string;
  description: string;
  promptText: string;
  thumbnailUrl?: string;
}

interface OptionPickerModalProps {
  title: string;
  options: OptionItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export default function OptionPickerModal({
  title,
  options,
  selectedId,
  onSelect,
  onClose,
}: OptionPickerModalProps) {
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter(
    (opt) =>
      opt.name.toLowerCase().includes(search.toLowerCase()) ||
      opt.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="relative rounded-2xl border border-white/10 bg-[#0c1520]/95 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
          {/* Top border ambient line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Search bar */}
          <div className="p-4 border-b border-white/5 bg-black/20">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 size-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search options..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                autoFocus
              />
            </div>
          </div>

          {/* Scrollable grid list */}
          <div className="p-6 overflow-y-auto flex-1 dropdown-scroll">
            {filteredOptions.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-sm">
                No matching options found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredOptions.map((opt) => {
                  const isSelected = opt.id === selectedId;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        onSelect(opt.id);
                        onClose();
                      }}
                      className={`flex flex-col text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-cyan-500/15 border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                          : "bg-white/5 border-white/5 hover:border-white/15 hover:bg-white/10"
                      }`}
                    >
                      <span
                        className={`text-sm font-bold tracking-tight transition-colors ${
                          isSelected ? "text-cyan-400" : "text-white"
                        }`}
                      >
                        {opt.name}
                      </span>
                      <span className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {opt.description}
                      </span>
                      {opt.promptText && (
                        <code className="text-[10px] text-cyan-500/80 bg-cyan-950/20 px-1.5 py-0.5 rounded border border-cyan-900/30 mt-2 self-start font-mono max-w-full truncate">
                          +{opt.promptText}
                        </code>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
