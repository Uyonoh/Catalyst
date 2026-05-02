"use client";

import { useState, useRef, useEffect } from "react";
import { useWorkspace } from "../../context/WorkspaceContext";
import {
  MessageSquare,
  Sparkles,
  Terminal,
  Image as ImageIcon,
  Box,
  Palette,
  ChevronDown,
  Zap,
  FileText,
  Code,
  Video,
} from "lucide-react";
import { useCatalog } from "../../context/CatalogContext";
import { Model, MODE_LABELS, getModelModes } from "../../lib/models-shared";

export const ICON_MAP: Record<string, any> = {
  chat: MessageSquare,
  auto_awesome: Sparkles,
  terminal: Terminal,
  image: ImageIcon,
  filter_frames: Box,
  palette: Palette,
  article: FileText,
  code: Code,
  video: Video,
};

export const getModelColor = (color: string) => {
  const colors: Record<string, string> = {
    cyan: "text-cyan-400 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:bg-cyan-500/10",
    purple:
      "text-purple-400 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:bg-purple-500/10",
    green:
      "text-green-400 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:bg-green-500/10",
    orange:
      "text-orange-400 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:bg-orange-500/10",
    pink: "text-pink-400 border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:bg-pink-500/10",
    blue: "text-blue-400 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:bg-blue-500/10",
    yellow:
      "text-yellow-400 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:bg-yellow-500/10",
    rose: "text-rose-400 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.3)] hover:bg-rose-500/10",
  };
  return colors[color] || colors.cyan;
};

export default function ModelSelector() {
  const {
    selectedModel: selectedModelId,
    setSelectedModel: setSelectedModelId,
  } = useWorkspace();
  const { models } = useCatalog();
  const selectedModel =
    models.find((m) => m.slug === selectedModelId) || models[0];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleModelSelect = (model: Model) => {
    setSelectedModelId(model.slug);
    setIsDropdownOpen(false);
    console.log(`Model selected: ${model.name}`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Desktop/Tablet Toggle */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`hidden sm:flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 rounded-lg bg-[#101922] border ${getModelColor(selectedModel.color)} text-sm font-bold transition-all focus:outline-none active:scale-95`}
        aria-label="Select AI model"
        aria-expanded={isDropdownOpen}
      >
        {(() => {
          const Icon = ICON_MAP[selectedModel.icon];
          return Icon ? <Icon className="size-4 md:size-5" /> : null;
        })()}
        <span className="hidden sm:inline">{selectedModel.name}</span>
        <ChevronDown
          className={`size-4 md:size-5 opacity-70 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Mobile Toggle Indicator */}
      <div className="sm:hidden flex items-center gap-2">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#101922] border ${getModelColor(selectedModel.color).split(" shadow")[0]} text-xs font-bold transition-all active:scale-95`}
          aria-label="Change AI model"
        >
          {(() => {
            const Icon = ICON_MAP[selectedModel.icon];
            return Icon ? <Icon className="size-4" /> : null;
          })()}
          <span className="text-[10px] font-semibold">
            {selectedModel.brief}
          </span>
        </button>
      </div>

      {/* Unified Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-72 md:w-80 z-50">
          <div className="glass-panel-dark rounded-xl p-2 border border-white/20 shadow-2xl shadow-black/50 animate-fadeIn">
            <div className="max-h-64 overflow-y-auto pr-1 thin-scrollbar">
              {models.map((model) => (
                <button
                  key={model.slug}
                  onClick={() => handleModelSelect(model)}
                  className={`flex items-center gap-3 w-full p-3 rounded-lg text-left transition-all hover:bg-white/5 ${selectedModel.slug === model.slug ? "bg-cyan-500/10 border border-cyan-500/30" : "border border-transparent"}`}
                  aria-label={`Select ${model.name}`}
                >
                  <div
                    className={`p-2 rounded-lg ${getModelColor(
                      model.slug === selectedModel.slug ? model.color : "slate",
                    )
                      .replace("text-", "bg-")
                      .replace("/50", "/20")
                      .replace(/hover.*$/, "")
                      .replace(/shadow.*$/, "")
                      .trim()}`}
                  >
                    {(() => {
                      const Icon = ICON_MAP[model.icon];
                      return Icon ? <Icon className="size-5" /> : null;
                    })()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-sm md:text-base truncate">
                      {model.name}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      {getModelModes(model)
                        .map((m) => MODE_LABELS[m])
                        .join(" · ")}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] md:text-xs px-2 py-1 rounded flex-shrink-0 ${selectedModel.slug === model.slug ? "bg-cyan-900/40 text-cyan-200" : "bg-slate-800/40 text-white"}`}
                  >
                    {model.type}
                  </span>
                </button>
              ))}
            </div>

            {/* Quick Stats Footer - Desktop Only */}
            <div className="hidden md:block mt-2 pt-2 border-t border-white/10">
              <div className="px-3 py-2 text-xs text-slate-400">
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center gap-1">
                    <Zap className="size-3.5 text-cyan-400" />
                    <span>Token Usage</span>
                  </span>
                  <span>450/1000</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1">
                  <div
                    className="bg-cyan-500 h-1 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                    style={{ width: "45%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
