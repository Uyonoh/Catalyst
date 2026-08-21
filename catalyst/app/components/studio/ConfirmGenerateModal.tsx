"use client";

import React from "react";
import { X, Sparkles, Loader2, Bot, Layers } from "lucide-react";
import { useCatalog } from "../../context/CatalogContext";
import {
  MODE_LABELS,
  ModelMode,
} from "../../lib/models-shared";

interface ConfirmGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isGenerating: boolean;
  mode?: string;
  targetModelId?: string;
  promptTitle?: string;
}

export default function ConfirmGenerateModal({
  isOpen,
  onClose,
  onConfirm,
  isGenerating,
  mode = "text",
  targetModelId,
  promptTitle,
}: ConfirmGenerateModalProps) {
  const { models } = useCatalog();

  if (!isOpen) return null;

  const selectedModel = models.find(
    (m) => m.slug === targetModelId || m.name === targetModelId,
  ) || {
    name: targetModelId || "Default Model",
    provider: "AI Engine",
    color: "cyan",
  };

  const modeDisplay =
    MODE_LABELS[mode as ModelMode] ||
    mode.charAt(0).toUpperCase() + mode.slice(1);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isGenerating) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in duration-200" />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        <div className="relative rounded-2xl border border-white/10 bg-[#0c1520]/95 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Top Gradient Line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/80 to-transparent" />
          <div className="absolute top-[-60px] right-[-40px] w-[200px] h-[200px] bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="p-6 sm:p-7 flex flex-col gap-5">
            {/* Close Button */}
            {!isGenerating && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            )}

            {/* Header Icon & Title */}
            <div className="flex items-center gap-3.5">
              <div className="flex items-center justify-center size-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                <Sparkles className="size-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white tracking-tight">
                  Confirm Output Generation
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Execute prompt on AI model
                </p>
              </div>
            </div>

            {/* Prompt details box */}
            <div className="flex flex-col gap-2.5 p-4 rounded-xl bg-white/[0.03] border border-white/10 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs flex items-center gap-1.5 font-medium">
                  <Bot className="size-3.5 text-cyan-400" />
                  Target Model:
                </span>
                <span className="font-semibold text-white text-xs px-2.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                  {selectedModel.name}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs flex items-center gap-1.5 font-medium">
                  <Layers className="size-3.5 text-purple-400" />
                  Generation Mode:
                </span>
                <span className="font-semibold text-white text-xs px-2.5 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300">
                  {modeDisplay}
                </span>
              </div>
            </div>

            {/* Clarifying prompt text */}
            <p className="text-xs text-slate-300 leading-relaxed">
              Generating output will run this prompt with mode{" "}
              <strong className="text-cyan-400">{modeDisplay}</strong> for the{" "}
              <strong className="text-white">{selectedModel.name}</strong>{" "}
              model. The resulting output will be saved directly to this prompt.
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isGenerating}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 font-bold text-xs hover:bg-white/5 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isGenerating}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-primary text-white font-bold text-xs shadow-neon hover:shadow-neon-strong transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    Confirm &amp; Generate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
