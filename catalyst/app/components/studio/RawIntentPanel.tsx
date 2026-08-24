"use client";

import React, { useState, useEffect } from "react";
import GlassPanel from "../GlassPanel";
import { useWorkspace } from "../../context/WorkspaceContext";
import { useUser } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import ModelSelector from "./ModelSelector";
import ModeSelector from "./ModeSelector";
import { useCatalog } from "../../context/CatalogContext";
import PromptControlsPanel from "./PromptControlsPanel";
import { getPreviewCost, TOKEN_COST_MATRIX } from "../../lib/tokens";
import { TokensMobile } from "../TokenMeter";

// Type for our cached token costs
interface TokenCostsCache {
  [key: string]: number;
}

// Global cache to store all token costs (shared across all instances)
let tokenCostsCache: TokenCostsCache | null = null;
let cachePromise: Promise<TokenCostsCache> | null = null;

/**
 * Fetches all token costs once and caches them.
 * Subsequent calls return the cached value.
 */
async function getAllTokenCosts(): Promise<TokenCostsCache> {
  // Return cached values if available
  if (tokenCostsCache) {
    return tokenCostsCache;
  }
  
  // If a fetch is already in progress, wait for it
  if (cachePromise) {
    return cachePromise;
  }
  
  // Fetch all token costs from the API
  cachePromise = fetch('/api/token-cost?all')
    .then(res => res.json())
    .then(data => {
      tokenCostsCache = data.costs || {};
      cachePromise = null;
      return tokenCostsCache;
    })
    .catch(() => {
      // On error, build fallback from TOKEN_COST_MATRIX
      cachePromise = null;
      const fallback: TokenCostsCache = {};
      for (const [modelSlug, modes] of Object.entries(TOKEN_COST_MATRIX)) {
        for (const [mode, cost] of Object.entries(modes)) {
          fallback[`${modelSlug}:${mode}`] = cost;
        }
      }
      tokenCostsCache = fallback;
      return tokenCostsCache;
    });
  
  return cachePromise;
}
import {
  FilePenLine,
  Zap,
  ImagePlus,
  Mic,
  History,
  Loader2,
  Sparkles,
  Settings2,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";

export default function RawIntentPanel() {
  const {
    input,
    setInput,
    selectedModel: selectedModelId,
    selectedMode,
    isLoading,
    result,
    isGenerating,
    parseIntent,
    controls,
    generationError,
    retryCount,
    clearGenerationError,
  } = useWorkspace();
  const { models } = useCatalog();
  const { user, profile } = useUser();
  const router = useRouter();
  const [showControls, setShowControls] = useState(false);
  const [tokenCosts, setTokenCosts] = useState<TokenCostsCache | null>(null);

  const selectedModel =
    models.find((m) => m.slug === selectedModelId) || models[0];

  // Load all token costs once on mount
  useEffect(() => {
    getAllTokenCosts().then(costs => {
      setTokenCosts(costs);
    });
  }, []);

  // Get cost from cache, fallback to TOKEN_COST_MATRIX if cache not loaded yet
  const cost = tokenCosts && selectedModel?.slug && selectedMode
    ? tokenCosts[`${selectedModel.slug}:${selectedMode}`] ?? getPreviewCost(selectedModel.slug, selectedMode)
    : getPreviewCost(selectedModel?.slug || '', selectedMode);

  return (
    <div className="relative group flex flex-col h-full">
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${isLoading ? "from-cyan-400 to-primary rounded-2xl blur-md opacity-75 animate-pulse" : "from-cyan-500 to-primary rounded-2xl blur opacity-30 group-hover:opacity-60"} transition-all duration-500`}
      />
      <div className="relative flex flex-col glass-panel rounded-xl p-4 md:p-6 h-full">
        {/* Header Section - Mobile Optimized */}
        <div className="flex flex-col gap-3 mb-4">
          {/* Title Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="bg-cyan-500/20 p-1.5 md:p-2 rounded-lg text-cyan-400">
                <FilePenLine className="size-5 md:size-6" />
              </div>
              <span className="text-xs hidden sm:block md:text-sm font-bold text-slate-200 uppercase tracking-wider">
                Raw Intent
              </span>
            </div>
            {/* Model Selection */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <ModeSelector />
                <ModelSelector />
              </div>
            </div>
          </div>
        </div>

        {/* Content Area - Toggle between Textarea and Controls */}
        <div className="relative flex-1 flex flex-col min-h-0">
          <div
            className={`transition-all duration-300 flex-1 flex flex-col ${showControls ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100"}`}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full flex-1 bg-transparent border-none text-base md:text-xl text-white placeholder:text-slate-600 focus:ring-0 resize-none leading-relaxed focus:outline-none min-h-[120px] md:min-h-[150px]"
              placeholder="Describe what you want to create... (e.g. 'I want a picture of a cyberpunk cat in a neon city raining at night')"
              aria-label="Prompt input"
            />
          </div>

          {/* Error Overlay */}
          {generationError && (
            <div className="absolute inset-0 z-20 flex items-center justify-center animate-in fade-in zoom-in duration-300 px-4">
              <div className="w-full max-w-md bg-rose-500/20 border border-rose-500/20 rounded-2xl p-6 backdrop-blur-sm shadow-2xl flex flex-col items-center text-center gap-4">
                <div className="size-12 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
                  <AlertCircle className="size-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-rose-100 font-bold text-lg">
                    Generation Failed
                  </h3>
                  <p className="text-rose-300 text-sm leading-relaxed">
                    {generationError}
                  </p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => clearGenerationError()}
                    className="flex-1 sm:flex-none px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors text-sm font-medium"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() =>
                      parseIntent({
                        text: input,
                        modelId: selectedModel.slug,
                        mode: selectedMode,
                        controls,
                      })
                    }
                    className="flex-1 sm:flex-none px-6 py-2 rounded-xl bg-rose-500 text-white hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <RefreshCcw className="size-4" />
                    <span className="hidden sm:block">Retry</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons - Mobile: Icons only in a grid */}
        <div className="flex justify-between">
          <div className="flex gap-1">
            <button
              className="p-3 md:p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center"
              title="Upload Image"
              aria-label="Upload Image"
            >
              <ImagePlus className="size-6 md:size-5" />
            </button>
            <button
              className="p-3 md:p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center"
              title="Voice Input"
              aria-label="Voice Input"
            >
              <Mic className="size-6 md:size-5" />
            </button>
            <button
              className="p-3 md:p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center"
              title="Prompt History"
              aria-label="Prompt History"
            >
              <History className="size-6 md:size-5" />
            </button>
          </div>

          {/* Mobile: Token Counter replaced by TokenMeter in Header or hide here */}
          <div className="flex md:hidden items-center gap-2 pr-2 text-xs text-slate-400">
            <Zap className="size-3.5 text-cyan-400" />
            {/* <span className="font-mono font-medium">Cost: {cost}</span> */}
            <TokensMobile />
          </div>
        </div>

        {/* Catalyze Button - Better mobile sizing */}
        <button
          className={`relative overflow-hidden bg-gradient-to-r from-cyan-500 to-primary text-white font-bold py-3.5 px-6 rounded-lg shadow-neon hover:shadow-neon-strong transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 w-full sm:w-auto ${!input.trim() || isGenerating ? "opacity-70 pointer-events-none" : ""}`}
          onClick={() => {
            if (!user) {
              if (typeof window !== "undefined") {
                localStorage.setItem("catalyst_guest_input", input);
              }
              router.push("/login?next=/studio");
              return;
            }
            if (showControls) setShowControls(false);
            parseIntent({
              text: input,
              modelId: selectedModel.slug,
              mode: selectedMode,
              controls,
            });
          }}
          disabled={!input.trim() || isGenerating}
          aria-label="Generate prompt"
        >
          <div
            className={`absolute inset-0 bg-white/20 hover:bg-transparent transition-colors ${!input.trim() || isGenerating ? "opacity-50" : ""}`}
          />
          {isGenerating ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              <span>
                {retryCount > 0
                  ? `Retrying (${retryCount}/3)...`
                  : "Generating..."}
              </span>
            </>
          ) : (
            <>
              <Sparkles className="size-5" />
              <div className="flex flex-col items-start leading-tight">
                <span>
                  {showControls ? "Apply & Generate" : "Generate Prompt"}
                </span>
                {profile?.plan !== "ultra" && (
                  <span className="text-[14px] font-normal">
                    Costs {cost} tokens
                  </span>
                )}
              </div>
            </>
          )}
        </button>
      </div>
    </div>
    // </div >
  );
}
