"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LibraryItem,
  formatUpdated,
} from "@/app/components/library/LibraryCard";
import {
  LayoutGrid,
  List,
  MoreHorizontal,
  Bot,
  Brain,
  Cloud,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  Plus,
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  smart_toy: Bot,
  psychology: Brain,
  cloud: Cloud,
  spark: Sparkles,
};

interface RecentPromptsProps {
  prompts: LibraryItem[];
}

// Fixed mapping for mockup consistency
const MappedColors = {
  green: "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]",
  yellow: "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]",
  purple: "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]",
};

const MappedTextColors = {
  green: "text-green-400",
  yellow: "text-yellow-400",
  purple: "text-purple-400",
};

export default function RecentPrompts({ prompts }: RecentPromptsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <section
      className="animate-slideDown"
      style={{ animationDelay: "0.3s", animationFillMode: "both" }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-white tracking-tight">
          Recent Prompts
        </h2>
        <div className="flex gap-2">
          <button className="size-8 flex items-center justify-center rounded-lg glass-panel hover:bg-white/10 text-white transition-colors cursor-pointer">
            <LayoutGrid className="size-5" />
          </button>
          <button className="size-8 flex items-center justify-center rounded-lg bg-transparent hover:bg-white/5 text-slate-500 hover:text-white transition-colors cursor-pointer">
            <List className="size-5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prompts.map((prompt) => (
          <div
            key={prompt.id}
            className="glass-panel rounded-2xl p-5 hover:border-cyan-500/30 transition-all duration-300 group hover:-translate-y-1 cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="size-5 text-slate-400 hover:text-white" />
            </div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className={`size-2 rounded-full ${MappedColors[prompt.icon_color as keyof typeof MappedColors] || MappedColors.green}`}
                ></div>
                <span
                  className={`text-xs font-mono ${MappedTextColors[prompt.icon_color as keyof typeof MappedTextColors] || MappedTextColors.green}`}
                >
                  {/* {prompt.status} */}Published
                </span>
              </div>
              <span className="text-xs text-slate-500">
                {formatUpdated(prompt.updated_at)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
              {prompt.title}
            </h3>
            <p className="text-slate-400 text-sm mb-4 line-clamp-2">
              {prompt.snippet}
            </p>
            <div className="flex items-center gap-2 mb-4">
              {prompt.tag && (
                <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-slate-300 border border-white/5">
                  {prompt.tag}
                </span>
              )}
              <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-slate-300 border border-white/5">
                AI Generated
              </span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                {(() => {
                  const Icon = ICON_MAP[prompt.icon];
                  return Icon ? (
                    <Icon className="size-4 text-slate-500" />
                  ) : (
                    <Bot className="size-4 text-slate-500" />
                  );
                })()}
                <span className="text-xs text-slate-400">{prompt.model}</span>
              </div>
              <div className="flex items-center gap-1 text-cyan-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleCopy(prompt.id, prompt.content || prompt.snippet);
                  }}
                  className={`p-1.5 hover:bg-white/10 rounded-md transition-colors ${copiedId === prompt.id ? "text-emerald-400" : "text-slate-400 hover:text-cyan-400"}`}
                  title={copiedId === prompt.id ? "Copied!" : "Copy Full Prompt"}
                >
                  {copiedId === prompt.id ? (
                    <Check className="size-5" />
                  ) : (
                    <Copy className="size-5" />
                  )}
                </button>
                <a
                  href={`/studio/${prompt?.id}`}
                  className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-cyan-400 transition-colors flex items-center justify-center"
                  title="Edit"
                >
                  <ArrowRight className="size-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Placeholder */}
        <Link
          href="/studio"
          className="border border-dashed border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center hover:bg-white/5 transition-colors cursor-pointer min-h-[220px]"
        >
          <div className="size-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
            <Plus className="size-6 text-slate-500" />
          </div>
          <span className="text-slate-500 text-sm font-medium">
            Create New Prompt
          </span>
        </Link>
      </div>
    </section>
  );
}
