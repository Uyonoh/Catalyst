"use client";

import React, { useState } from "react";
import GlassPanel from "../GlassPanel";
import { useWorkspace } from "../../context/WorkspaceContext";
import { Activity, ChevronUp, Copy } from "lucide-react";

const getMetadataStyles = (type: string) => {
  const styles: Record<string, string> = {
    domain: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300",
    intent: "bg-purple-500/10 border-purple-500/30 text-purple-300",
    tone: "bg-blue-500/10 border-blue-500/30 text-blue-300",
    format: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    variable: "bg-pink-500/10 border-pink-500/30 text-pink-300",
  };
  return styles[type] || "bg-slate-500/10 border-slate-500/30 text-slate-300";
};

export default function LiveAnalysisPanel() {
  const { result, isLoading } = useWorkspace();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
  };

  const confidencePercent = result?.metadata?.confidenceScore
    ? Math.round(result.metadata.confidenceScore * 100)
    : 0;

  // Prepare entities from metadata
  const entities: { type: string; label: string }[] = [];
  if (result?.metadata) {
    const meta = result.metadata;
    if (meta.detectedDomain)
      entities.push({
        type: "domain",
        label: meta.detectedDomain.split("_").join(" "),
      });
    if (meta.primaryIntent)
      entities.push({ type: "intent", label: meta.primaryIntent });
    if (meta.constraints?.tone)
      entities.push({ type: "tone", label: meta.constraints.tone });
    if (meta.constraints?.outputFormat)
      entities.push({ type: "format", label: meta.constraints.outputFormat });
    if (meta.variables) {
      Object.keys(meta.variables).forEach((v) => {
        entities.push({ type: "variable", label: `{{${v}}}` });
      });
    }
  }

  return (
    <GlassPanel
      gradientBorder
      className="border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.05)] p-4 md:p-6 flex flex-col h-full"
    >
      {/* ── Panel Header (always visible) ───────────────────── */}
      <div className="flex items-center justify-between mb-0">
        <div className="flex items-center gap-3">
          <div className="bg-purple-500/20 p-2 rounded-lg text-purple-400">
            <Activity className="size-5" />
          </div>
          <span className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Engine Analysis
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Live status indicator */}
          <div className="flex items-center gap-2 text-xs font-medium text-cyan-400">
            <span className="relative flex h-2 w-2">
              {isLoading && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 transition-colors duration-500 ${
                  isLoading ? "bg-cyan-500" : "bg-slate-600"
                }`}
              />
            </span>
            <span className="hidden sm:inline">
              {isLoading
                ? "Real-time Parsing..."
                : result
                  ? "Analysis Complete"
                  : "Waiting for Input"}
            </span>
          </div>

          {/* Collapse / Expand toggle button */}
          <button
            id="live-analysis-toggle"
            onClick={() => setIsCollapsed((prev) => !prev)}
            aria-label={
              isCollapsed ? "Expand analysis panel" : "Collapse analysis panel"
            }
            aria-expanded={!isCollapsed}
            className={`
              flex items-center justify-center
              w-8 h-8 rounded-lg
              border transition-all duration-200
              active:scale-95
              ${
                isCollapsed
                  ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/25"
                  : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200"
              }
            `}
          >
            <ChevronUp
              className={`size-4.5 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isCollapsed ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* ── Collapsible Body ─────────────────────────────────── */}
      <div
        className={`panel-body flex-1 flex flex-col gap-0 ${isCollapsed ? "panel-body--collapsed" : ""}`}
      >
        <div className="flex flex-col gap-6 flex-1 pt-6">
          {/* Confidence Score */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">
                Confidence Score ({result?.metadata?.primaryIntent || "Unknown"}
                )
              </span>
              <span className="text-cyan-400 font-bold">
                {confidencePercent}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-cyan-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${confidencePercent}%` }}
              />
            </div>
          </div>

          {/* Detected Metadata */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Extracted Metadata
            </span>
            <div className="flex flex-wrap gap-2 min-h-[32px]">
              {entities.length > 0 ? (
                entities.map((entity, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1 rounded-full border text-xs font-medium transition-all animate-fadeIn ${getMetadataStyles(entity.type)}`}
                  >
                    {entity.label}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-600 italic">
                  No metadata detected yet
                </span>
              )}
            </div>
          </div>

          {/* Syntax Preview */}
          <div className="flex-1 flex flex-col space-y-2 min-h-[140px]">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Compilation Preview
              </span>
              <span className="text-[10px] text-slate-600 font-mono hidden sm:inline">
                {result?.model || "GENERATING"}
              </span>
            </div>

            <div
              className={`code-preview flex-1 rounded-lg p-4 overflow-hidden relative group bg-black/20 border transition-all duration-300 ${
                isLoading
                  ? "border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                  : "border-white/5"
              }`}
            >
              {/* Refreshing Overlay */}
              {isLoading && (
                <div className="absolute inset-0 z-10 bg-[#101922]/40 backdrop-blur-[1px] flex items-center justify-center animate-fadeIn">
                  <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-full border border-cyan-500/30 shadow-2xl">
                    <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-tighter">
                      Refreshing Engine
                    </span>
                  </div>
                </div>
              )}

              {result && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <button
                    onClick={copyToClipboard}
                    className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white"
                    aria-label="Copy code"
                  >
                    <Copy className="size-4" />
                  </button>
                </div>
              )}

              <code
                className={`text-sm font-mono leading-relaxed block text-slate-300 overflow-x-auto transition-opacity duration-300 ${
                  isLoading ? "opacity-40" : "opacity-100"
                }`}
              >
                {result ? (
                  <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                    {result.systemInstruction && (
                      <div>
                        <span className="text-slate-500 text-[10px] block mb-1 uppercase">
                          System Instruction
                        </span>
                        <div className="text-blue-300 bg-blue-500/5 p-2 rounded border border-blue-500/10">
                          {result.systemInstruction}
                        </div>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-500 text-[10px] block mb-1 uppercase">
                        Formatted Prompt
                      </span>
                      <pre className="whitespace-pre-wrap text-emerald-300 p-2 bg-emerald-500/5 rounded border border-emerald-500/10 overflow-x-auto">
                        {typeof result.formattedPrompt === "string"
                          ? result.formattedPrompt
                          : JSON.stringify(result.formattedPrompt, null, 2)}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <span className="text-slate-600 italic">
                    Waiting for compiler results...
                  </span>
                )}
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* ── Collapsed Hint (visible only when collapsed) ─────── */}
      <div
        className={`transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${
          isCollapsed ? "max-h-12 opacity-100 mt-3" : "max-h-0 opacity-0 mt-0"
        }`}
      >
        <p className="text-xs text-slate-500 italic text-center">
          {isLoading
            ? "Engine is analysing…"
            : result
              ? `${confidencePercent}% confidence · ${entities.length} signal${entities.length !== 1 ? "s" : ""} detected`
              : "No analysis yet — start typing in the Studio."}
        </p>
      </div>
    </GlassPanel>
  );
}
