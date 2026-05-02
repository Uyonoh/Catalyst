"use client";

import React, { useState, useRef, useEffect } from "react";
import { useWorkspace } from "../../context/WorkspaceContext";
import { useCatalog } from "../../context/CatalogContext";
import { useUser } from "../../context/AuthContext";
import { getPreviewCost } from "../../lib/tokens";
import {
  FileText,
  Image as ImageIcon,
  Video,
  Mic,
  Code,
  Eye,
  ChevronDown,
  Zap,
} from "lucide-react";
import {
  ModelMode,
  MODE_LABELS,
  getModelModes,
  isMultimodal,
} from "../../lib/models-shared";

const MODE_ICON_MAP: Record<ModelMode, any> = {
  text: FileText,
  image: ImageIcon,
  video: Video,
  audio: Mic,
  code: Code,
  vision: Eye,
};

export default function ModeSelector() {
  const {
    selectedModel: selectedModelId,
    selectedMode,
    setSelectedMode,
  } = useWorkspace();
  const { models } = useCatalog();
  const { profile } = useUser();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const model = models.find((m) => m.slug === selectedModelId) || models[0];
  const multimodal = model ? isMultimodal(model) : false;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!model) return null;

  const modes = getModelModes(model);
  const CurrentIcon = MODE_ICON_MAP[selectedMode] || FileText;

  const showCost = profile?.plan !== "enterprise";
  const selectedCost = getPreviewCost(model.slug, selectedMode);

  return (
    <div
      ref={dropdownRef}
      className={`transition-all duration-500 ease-in-out flex items-center
        ${multimodal ? "opacity-100" : "opacity-0 pointer-events-none w-0"}`}
    >
      {/* Mobile Dropdown View */}
      <div className="md:hidden relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-cyan-400 text-xs font-bold transition-all active:scale-95"
        >
          <CurrentIcon className="size-3.5" />
          <span>{MODE_LABELS[selectedMode]}</span>
          {showCost && (
            <div className="flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded-md bg-white/10 text-white font-mono scale-90">
              <Zap className="size-2.5" />
              <span>{selectedCost}</span>
            </div>
          )}
          <ChevronDown
            className={`size-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-32 glass-panel-dark rounded-xl p-1 z-50 border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-200 origin-top-left">
            {modes.map((mode) => {
              const Icon = MODE_ICON_MAP[mode] || FileText;
              const isActive = selectedMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => {
                    setSelectedMode(mode);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-bold transition-all
                    ${isActive ? "bg-cyan-500/20 text-cyan-300" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
                >
                  <Icon className="size-3.5" />
                  <span className="flex-1">{MODE_LABELS[mode]}</span>
                  {showCost && (
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/5 text-white/70 font-mono group-hover:text-white transition-colors">
                      <Zap className="size-2.5" />
                      <span>{getPreviewCost(model.slug, mode)}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop Chip View */}
      <div className="hidden md:flex items-center gap-1 bg-white/5 backdrop-blur-md rounded-xl p-1 border border-white/10 shadow-inner">
        {modes.map((mode) => {
          const Icon = MODE_ICON_MAP[mode] || FileText;
          const isActive = selectedMode === mode;

          return (
            <button
              key={mode}
              onClick={() => setSelectedMode(mode)}
              className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300
                ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
                }`}
              aria-pressed={isActive}
              title={`${MODE_LABELS[mode]} Mode`}
            >
              <Icon
                className={`size-3.5 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
              />
              <span className="hidden lg:inline overflow-hidden whitespace-nowrap">
                {MODE_LABELS[mode]}
              </span>

              {showCost && (
                <div
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md font-mono transition-all
                    ${isActive ? "bg-white/20 text-white" : "bg-white/5 text-white/50 group-hover:text-white/80"}`}
                >
                  <Zap className="size-2.5" />
                  <span className="text-[10px]">
                    {getPreviewCost(model.slug, mode)}
                  </span>
                </div>
              )}

              {isActive && (
                <span className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_rgba(6,182,212,1)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
