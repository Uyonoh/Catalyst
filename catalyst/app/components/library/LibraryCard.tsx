"use client";

import React, { useState } from "react";
import GlassPanel from "../GlassPanel";
import {
  MoreVertical,
  Copy,
  Check,
  Edit,
  Sparkles,
  MessageSquare,
  Image as ImageIcon,
  Terminal,
  Box,
  Palette,
  FileText,
  Code,
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  auto_awesome: Sparkles,
  chat: MessageSquare,
  image: ImageIcon,
  terminal: Terminal,
  filter_frames: Box,
  palette: Palette,
  article: FileText,
  code: Code,
};

export interface LibraryItem {
  id: string;
  title: string;
  updated_at: string;
  snippet: string;
  content: string;
  model: string;
  model_color: string;
  tag: string;
  icon: string;
  icon_color: string;
  has_gradient: boolean;
}

interface LibraryCardProps {
  item: LibraryItem;
}

export function formatUpdated(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);
  const weeks = Math.floor(days / 7);
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return `${weeks}w ago`;
}

export default function LibraryCard({ item }: LibraryCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(item.content || item.snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <GlassPanel
      hoverable
      className="p-5 flex flex-col gap-4 group cursor-pointer relative overflow-hidden active:scale-[0.98] transition-all h-full"
    >
      {item.has_gradient && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-bl-full -mr-4 -mt-4 transition-opacity opacity-50 group-hover:opacity-100" />
      )}
      <div className="flex justify-between items-start z-10">
        <div className="flex items-center gap-3">
          <div
            className={`size-10 rounded-lg bg-${item.icon_color}-500/10 flex items-center justify-center text-${item.icon_color}-400 border border-${item.icon_color}-500/20`}
          >
            {(() => {
              const Icon = ICON_MAP[item.icon];
              return Icon ? (
                <Icon className="size-5" />
              ) : (
                <FileText className="size-5" />
              );
            })()}
          </div>
          <div>
            <h3 className="text-white font-bold leading-tight group-hover:text-cyan-400 transition-colors">
              {item.title}
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Updated {formatUpdated(item.updated_at)}
            </p>
          </div>
        </div>
        <button
          className="text-slate-500 hover:text-cyan-400 transition-colors"
          aria-label="More options"
        >
          <MoreVertical className="size-5" />
        </button>
      </div>
      <div className="h-[1px] w-full bg-white/5" />
      <p className="text-slate-300 text-sm leading-relaxed line-clamp-3 font-mono opacity-80 code-preview p-2 rounded border border-white/10 bg-white/5">
        {item.snippet}
      </p>
      <div className="mt-auto pt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded bg-${item.model_color}-500/10 border border-${item.model_color}-500/20 text-[10px] font-semibold text-${item.model_color}-400 uppercase tracking-wide`}
          >
            {item.model}
          </span>
          <span className="text-slate-500 text-xs font-medium">{item.tag}</span>
        </div>
        <div className="flex gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className={`p-1.5 hover:bg-white/10 rounded-md transition-colors ${copied ? "text-emerald-400" : "text-slate-400 hover:text-cyan-400"}`}
            title={copied ? "Copied!" : "Copy Full Prompt"}
          >
            {copied ? (
              <Check className="size-5" />
            ) : (
              <Copy className="size-5" />
            )}
          </button>
          <a
            href={`/studio/${item.id}`}
            className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-cyan-400 transition-colors flex items-center justify-center"
            title="Edit"
          >
            <Edit className="size-5" />
          </a>
        </div>
      </div>
    </GlassPanel>
  );
}
