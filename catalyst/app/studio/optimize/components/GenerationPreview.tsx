"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, RefreshCw, AlertTriangle, HelpCircle } from "lucide-react";
import { useWorkspace } from "../../../context/WorkspaceContext";
import { GenerateStatus, GenerateResult } from "../hooks/useImageGenerate";
import ModelSelector from "./ImageModelSelector";

interface GenerationPreviewProps {
  status: GenerateStatus;
  result: GenerateResult | null;
  error: string | null;
  onGenerate: (model: string) => void;
  hasSubject: boolean;
  onValidationFail: () => void;
}

export default function GenerationPreview({
  status,
  result,
  error,
  onGenerate,
  hasSubject,
  onValidationFail,
}: GenerationPreviewProps) {
  const [validationError, setValidationError] = useState<string | null>(null);

   const {
     selectedModel: selectedModelId,
     setSelectedModel: setSelectedModelId,
   } = useWorkspace();

  const handleGenerateClick = (model: string) => {
    setValidationError(null);
    if (!hasSubject) {
      setValidationError("Please enter a subject description first.");
      onValidationFail();
      return;
    }
    onGenerate(model);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Action / Trigger Row */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center justify-between w-full gap-3">
        <span className="hidden sm:inline"> <ModelSelector /> </span>
        <button
          onClick={() => handleGenerateClick(selectedModelId)}
          disabled={status === "loading"}
          className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-primary text-white font-black text-sm shadow-neon hover:shadow-neon-strong transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Generating Scene...
            </>
          ) : (
            <>
              <Sparkles className="size-5" />
              Generate Image
            </>
          )}
        </button>
        <span className="flex sm:hidden"> <ModelSelector /> </span>
        </div>

        {validationError && (
          <span className="text-xs text-rose-400 font-bold flex items-center gap-1.5 animate-bounce">
            <AlertTriangle className="size-3.5" />
            {validationError}
          </span>
        )}
      </div>

      {/* Main Preview Container */}
      <div className="relative rounded-2xl border border-white/10 bg-black/40 overflow-hidden flex flex-col items-center justify-center min-h-[350px] group">
        
        {/* Shimmer overlay background */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-primary/5 opacity-50 pointer-events-none" />

        {/* 1. IDLE STATE */}
        {status === "idle" && (
          <div className="p-8 flex flex-col items-center text-center max-w-sm">
            <div className="flex items-center justify-center size-14 rounded-2xl bg-white/5 border border-white/10 mb-4">
              <HelpCircle className="size-6 text-slate-400" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              Ready to generate
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complete your prompt construction settings and hit 'Generate Image' to render the output canvas.
            </p>
          </div>
        )}

        {/* 2. LOADING STATE */}
        {status === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xs p-8">
            <div className="w-full h-full animate-pulse bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-xl absolute inset-0" />
            <div className="relative z-10 flex flex-col items-center">
              <Loader2 className="size-8 animate-spin text-cyan-400 mb-3" />
              <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest animate-pulse">
                Synthesizing graphics...
              </p>
            </div>
          </div>
        )}

        {/* 3. ERROR STATE */}
        {status === "error" && (
          <div className="p-8 flex flex-col items-center text-center max-w-sm relative z-10">
            <div className="flex items-center justify-center size-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 mb-4">
              <AlertTriangle className="size-6 text-rose-400" />
            </div>
            <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider mb-2">
              Synthesis Failure
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {error || "An unexpected error occurred while communicating with the engine."}
            </p>
            <button
              onClick={() => handleGenerateClick(selectedModelId)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all cursor-pointer"
            >
              <RefreshCw className="size-3" />
              Try Again
            </button>
          </div>
        )}

        {/* 4. SUCCESS STATE */}
        {status === "success" && result && (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
            <img
              src={result.url}
              alt="Generated Result"
              className="max-w-full max-h-[500px] object-contain rounded-xl shadow-2xl border border-white/5"
            />
            
            {/* Metadata Footer bar */}
            <div className="w-full flex items-center justify-between mt-3 px-1 text-[10px] text-slate-500 font-medium">
              <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5">
                Resolution: {result.width} × {result.height}px
              </span>
              <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5 font-mono">
                Seed: {result.seed}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
