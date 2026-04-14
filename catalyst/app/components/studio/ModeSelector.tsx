"use client";

import React from "react";
import { useWorkspace } from "../../context/WorkspaceContext";
import { useCatalog } from "../../context/CatalogContext";
import {
  FileText,
  Image as ImageIcon,
  Video,
  Mic,
  Code,
  Eye,
} from "lucide-react";
import { ModelMode, MODE_LABELS, getModelModes, isMultimodal } from "../../lib/models-shared";

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

  const model = models.find((m) => m.slug === selectedModelId) || models[0];
  const multimodal = model ? isMultimodal(model) : false;

  if (!model) return null;

  const modes = getModelModes(model);

  return (
    <div
      className={`transition-all duration-500 ease-in-out overflow-hidden flex items-center
        ${multimodal ? "max-w-[500px] opacity-100" : "max-w-0 opacity-0 pointer-events-none"}`}
    >
      <div className="flex items-center gap-1 bg-white/5 backdrop-blur-md rounded-xl p-1 border border-white/10 shadow-inner">
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
              <span className="hidden md:inline overflow-hidden whitespace-nowrap">
                {MODE_LABELS[mode]}
              </span>
              
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
