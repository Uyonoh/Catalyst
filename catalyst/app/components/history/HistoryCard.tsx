"use client";

import React, { useState } from "react";
import GlassPanel from "../GlassPanel";
import { 
  Copy, 
  Check, 
  Edit, 
  Clock, 
  ArrowRight,
  Sparkles,
  Zap,
  Cpu,
  BrainCircuit,
  Trash2
} from "lucide-react";
import { formatUpdated } from "../library/LibraryCard";
import { supabase } from "../../lib/supabase";

const MODEL_ICONS: Record<string, any> = {
  "gpt-4": BrainCircuit,
  "gpt-4-turbo": BrainCircuit,
  "gpt-4o": BrainCircuit,
  "claude-3-opus": Cpu,
  "claude-3-sonnet": Cpu,
  "claude-3-haiku": Cpu,
  "gemini-1.5-pro": Sparkles,
  "gemini-1.5-flash": Zap,
};

export interface HistoryItem {
  id: string;
  title: string;
  content: string;
  snippet: string;
  raw_input: string;
  target_model: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
}

interface HistoryCardProps {
  item: HistoryItem;
  onDelete?: (id: string) => void;
}

export default function HistoryCard({ item, onDelete }: HistoryCardProps) {
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(item.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this prompt from your history?")) {
      setIsDeleting(true);
      try {
        const { error } = await supabase.from("prompts").delete().eq("id", item.id);
        if (error) throw error;
        if (onDelete) onDelete(item.id);
      } catch (err) {
        console.error("Error deleting prompt:", err);
        setIsDeleting(false);
      }
    }
  };

  const Icon = MODEL_ICONS[item.target_model] || BrainCircuit;

  return (
    <GlassPanel 
      hoverable 
      className={`p-5 flex flex-col gap-4 group cursor-pointer relative overflow-hidden active:scale-[0.98] transition-all h-full ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <div className="flex justify-between items-start z-10">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
            <Icon className="size-5" />
          </div>
          <div>
            <h3 className="text-white font-bold leading-tight group-hover:text-cyan-400 transition-colors line-clamp-1">
              {item.title || "Untitled Prompt"}
            </h3>
            <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
              <Clock className="size-3" />
              <span>{formatUpdated(item.updated_at || item.created_at)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={handleDelete}
            className="p-1.5 hover:bg-red-500/10 rounded-md text-slate-500 hover:text-red-400 transition-colors"
            title="Delete"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Raw Intent</span>
          <p className="text-slate-400 text-sm line-clamp-2 italic bg-white/5 p-2 rounded-lg border border-white/5">
            "{item.raw_input}"
          </p>
        </div>

        <div className="flex items-center justify-center py-1">
          <ArrowRight className="size-4 text-cyan-500/40" />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-cyan-500/70 uppercase tracking-wider">Optimized Prompt</span>
          <p className="text-slate-200 text-sm line-clamp-3 font-mono bg-cyan-500/5 p-3 rounded-lg border border-cyan-500/10 group-hover:border-cyan-500/30 transition-colors">
            {item.content}
          </p>
        </div>
      </div>

      <div className="mt-auto pt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-semibold text-cyan-400 uppercase tracking-wide">
            {item.target_model}
          </span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              copied 
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                : "bg-white/5 text-slate-400 hover:bg-cyan-500/10 hover:text-cyan-400 border border-white/10 hover:border-cyan-500/30"
            }`}
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
          
          <a
            href={`/studio/${item.id}${!item.is_public ? '?private=true' : ''}`}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all shadow-[0_0_12px_rgba(6,182,212,0.1)]"
          >
            <Edit className="size-3.5" />
            Edit
          </a>
        </div>
      </div>
    </GlassPanel>
  );
}
