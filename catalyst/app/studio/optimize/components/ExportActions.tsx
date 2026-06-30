"use client";

import React, { useState } from "react";
import { Copy, Check, Download, FileText, Share2 } from "lucide-react";
import GlassPanel from "../../../components/GlassPanel";
import { FieldsState } from "../hooks/usePromptBuilder";

interface ExportActionsProps {
  assembledPrompt: string;
  fields: FieldsState;
  onNotify: (msg: string, type: "success" | "info" | "error") => void;
}

export default function ExportActions({
  assembledPrompt,
  fields,
  onNotify,
}: ExportActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!assembledPrompt) {
      onNotify("Nothing to copy yet. Build a prompt first.", "error");
      return;
    }
    
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(assembledPrompt);
      } else {
        // Fallback clipboard method
        const textarea = document.createElement("textarea");
        textarea.value = assembledPrompt;
        textarea.style.position = "fixed";  // Avoid scrolling to bottom
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopied(true);
      onNotify("Prompt copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
      onNotify("Failed to copy prompt.", "error");
    }
  };

  const handleExportJSON = () => {
    if (!assembledPrompt) {
      onNotify("Build a prompt before exporting.", "error");
      return;
    }

    try {
      const data = {
        generator: "Catalyst Image Studio",
        assembledPrompt,
        fields,
        exportedAt: new Date().toISOString(),
      };

      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `catalyst-scene-export-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
      onNotify("Exported configurations as JSON", "success");
    } catch (e) {
      onNotify("Failed to export JSON file.", "error");
    }
  };

  const handleExportTXT = () => {
    if (!assembledPrompt) {
      onNotify("Build a prompt before exporting.", "error");
      return;
    }

    try {
      const blob = new Blob([assembledPrompt], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `catalyst-prompt-${Date.now()}.txt`;
      link.click();
      URL.revokeObjectURL(url);
      onNotify("Exported prompt as TXT", "success");
    } catch (e) {
      onNotify("Failed to export TXT file.", "error");
    }
  };

  return (
    <GlassPanel className="p-4 flex flex-col gap-3">
      <div className="flex items-center gap-1.5 border-b border-white/10 pb-2">
        <Share2 className="size-4 text-cyan-400" />
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          Export Actions
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {/* Copy Prompt */}
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl border text-left cursor-pointer transition-all active:scale-98 ${
            copied
              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
              : "bg-white/5 border-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
          }`}
        >
          {copied ? <Check className="size-4 shrink-0" /> : <Copy className="size-4 shrink-0" />}
          <span>{copied ? "Copied Prompt!" : "Copy Assembled Prompt"}</span>
        </button>

        {/* Export config JSON */}
        <button
          onClick={handleExportJSON}
          className="flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-left cursor-pointer transition-all active:scale-98"
        >
          <Download className="size-4 shrink-0" />
          <span>Export Configuration (JSON)</span>
        </button>

        {/* Export text only */}
        <button
          onClick={handleExportTXT}
          className="flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-left cursor-pointer transition-all active:scale-98"
        >
          <FileText className="size-4 shrink-0" />
          <span>Export Prompt Text (TXT)</span>
        </button>
      </div>
    </GlassPanel>
  );
}
