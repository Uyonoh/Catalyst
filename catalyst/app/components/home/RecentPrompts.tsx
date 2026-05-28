"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  formatUpdated,
} from "@/app/components/library/LibraryCard";
import {
  LayoutGrid,
  List,
  Bot,
  Copy,
  Check,
  ArrowRight,
  Plus,
  Search,
  Filter
} from "lucide-react";
import { ICON_MAP } from "@/app/components/studio/ModelSelector";
import {
  PROMPT_TYPE_TOKENS,
  PROMPT_TYPE_FALLBACK,
  MODEL_BADGE_TOKENS,
  MODEL_BADGE_FALLBACK,
} from "../../lib/promptTokens";

export interface RecentItem {
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
  raw_input: string;
  target_model: string;
  created_at: string;
  is_public: boolean;
}

interface RecentPromptsProps {
  prompts: RecentItem[];
}

export default function RecentPrompts({ prompts }: RecentPromptsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Extract unique tags present in the recent prompts list
  const uniqueTags = useMemo(() => {
    const tags = new Set<string>();
    prompts.forEach((p) => {
      if (p.tag) tags.add(p.tag);
    });
    return Array.from(tags);
  }, [prompts]);

  // Filter prompts based on search term & selected tag
  const filteredPrompts = useMemo(() => {
    return prompts.filter((p) => {
      const matchesSearch = 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tag && p.tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.model.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTag = !selectedTag || p.tag === selectedTag;

      return matchesSearch && matchesTag;
    });
  }, [prompts, searchQuery, selectedTag]);

  return (
    <section
      className="animate-slideDown"
      style={{ animationDelay: "0.3s", animationFillMode: "both" }}
    >
      {/* Heading & Toggles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Recent Prompts
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">Manage and organize your custom intelligence catalog</p>
        </div>
        
        {/* Layout controls & Search bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] md:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
              <Search className="size-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog prompts..."
              className="w-full bg-white/5 border border-white/5 focus:border-cyan-500 rounded-xl text-xs py-2 pl-9 pr-4 text-white outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all placeholder:text-slate-500"
            />
          </div>

          <div className="flex bg-white/5 rounded-xl border border-white/5 p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === "grid" ? "bg-white/10 text-cyan-400 shadow-sm" : "text-slate-400 hover:text-white"}`}
              title="Grid View"
            >
              <LayoutGrid className="size-4.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === "list" ? "bg-white/10 text-cyan-400 shadow-sm" : "text-slate-400 hover:text-white"}`}
              title="List View"
            >
              <List className="size-4.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Tag Filters */}
      {uniqueTags.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 dropdown-scroll">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
              !selectedTag
                ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.2)]"
                : "bg-white/5 text-slate-400 border-white/5 hover:border-white/10 hover:text-slate-200"
            }`}
          >
            All Categories
          </button>
          {uniqueTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                selectedTag === tag
                  ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.2)]"
                  : "bg-white/5 text-slate-400 border-white/5 hover:border-white/10 hover:text-slate-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Prompts list grid / list rendering */}
      {filteredPrompts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-white/10 rounded-2xl bg-white/[0.01] text-center">
          <Bot className="size-12 text-slate-600 mb-3 opacity-50" />
          <h3 className="text-white font-bold text-sm">No Matching Prompts</h3>
          <p className="text-slate-500 text-xs mt-1 max-w-sm">No items match your active search terms or category selectors. Create a new prompt in the Studio to expand catalog.</p>
          <Link href="/studio" className="mt-4 flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[--color-primary] to-cyan-500 text-white text-xs font-bold rounded-lg hover:shadow-lg transition-all duration-300">
            <Plus className="size-4" /> New Prompt
          </Link>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW LAYOUT */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300">
          {filteredPrompts.map((prompt) => (
            <div
              key={prompt.id}
              className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-cyan-500/30 transition-all duration-300 group hover:-translate-y-1 cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`size-2 rounded-full ${prompt.is_public ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-slate-500"}`}
                  ></div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${prompt.is_public ? "text-emerald-400" : "text-slate-500"}`}
                  >
                    {prompt.is_public ? "Public" : "Private"}
                  </span>
                </div>
                <span className="text-xs text-slate-500 leading-none">
                  {formatUpdated(prompt.updated_at)}
                </span>
              </div>
              
              <div className="flex items-start gap-4 mb-4">
                {(() => {
                  const token =
                    PROMPT_TYPE_TOKENS[prompt.icon] || PROMPT_TYPE_FALLBACK;
                  const { Icon } = token;
                  return (
                    <div
                      className={`size-10 rounded-lg ${token.bg} flex items-center justify-center ${token.text} border ${token.border} group-hover:scale-110 transition-transform flex-shrink-0`}
                    >
                      <Icon className="size-5" />
                    </div>
                  );
                })()}
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors truncate">
                    {prompt.title}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-2">
                    {prompt.snippet}
                  </p>
                </div>
              </div>

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
                    const token =
                      MODEL_BADGE_TOKENS[prompt.model_color] ||
                      MODEL_BADGE_FALLBACK;
                    return (
                      <div
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${token.bg} border ${token.border} ${token.text}`}
                      >
                        {Icon ? (
                          <Icon className="size-3.5" />
                        ) : (
                          <Bot className="size-3.5" />
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-wide">
                          {prompt.model}
                        </span>
                      </div>
                    );
                  })()}
                </div>
                <div className="flex items-center gap-1 text-cyan-400 text-xs font-medium sm:opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
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
                    href={`/studio/${prompt.id}${!prompt.is_public ? "?private=true" : ""}`}
                    className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-cyan-400 transition-colors flex items-center justify-center"
                    title="Edit"
                  >
                    <ArrowRight className="size-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Placeholder Card */}
          <Link
            href="/studio"
            className="border border-dashed border-white/10 hover:border-cyan-500/20 rounded-2xl p-5 flex flex-col items-center justify-center hover:bg-white/[0.03] transition-all cursor-pointer min-h-[220px]"
          >
            <div className="size-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <Plus className="size-6 text-slate-500" />
            </div>
            <span className="text-slate-500 text-sm font-medium">
              Create New Prompt
            </span>
          </Link>
        </div>
      ) : (
        /* LIST VIEW LAYOUT */
        <div className="flex flex-col gap-3 transition-all duration-300">
          {filteredPrompts.map((prompt) => (
            <div
              key={prompt.id}
              className="glass-panel rounded-xl p-4 border border-white/5 hover:border-cyan-500/30 hover:bg-white/[0.03] transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group cursor-pointer"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                {(() => {
                  const token =
                    PROMPT_TYPE_TOKENS[prompt.icon] || PROMPT_TYPE_FALLBACK;
                  const { Icon } = token;
                  return (
                    <div
                      className={`size-9 rounded-lg ${token.bg} flex items-center justify-center ${token.text} border ${token.border} group-hover:scale-105 transition-transform flex-shrink-0`}
                    >
                      <Icon className="size-4.5" />
                    </div>
                  );
                })()}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors truncate">
                      {prompt.title}
                    </h3>
                    {prompt.tag && (
                      <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] text-slate-400 border border-white/5 uppercase">
                        {prompt.tag}
                      </span>
                    )}
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${prompt.is_public ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-slate-500"}`}>
                      {prompt.is_public ? "Public" : "Private"}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs line-clamp-1">
                    {prompt.snippet}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                <div className="flex items-center gap-2.5">
                  {(() => {
                    const Icon = ICON_MAP[prompt.icon];
                    const token =
                      MODEL_BADGE_TOKENS[prompt.model_color] ||
                      MODEL_BADGE_FALLBACK;
                    return (
                      <div
                        className={`flex items-center gap-1 px-2 py-0.5 rounded ${token.bg} border ${token.border} ${token.text}`}
                      >
                        {Icon ? (
                          <Icon className="size-3" />
                        ) : (
                          <Bot className="size-3" />
                        )}
                        <span className="text-[9px] font-black uppercase tracking-wider">
                          {prompt.model}
                        </span>
                      </div>
                    );
                  })()}
                  <span className="text-[10px] text-slate-500 font-medium">
                    {formatUpdated(prompt.updated_at)}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleCopy(prompt.id, prompt.content || prompt.snippet);
                    }}
                    className={`p-1.5 hover:bg-white/10 rounded-md transition-colors ${copiedId === prompt.id ? "text-emerald-400" : "text-slate-400 hover:text-cyan-400"}`}
                    title={copiedId === prompt.id ? "Copied!" : "Copy Full Prompt"}
                  >
                    {copiedId === prompt.id ? (
                      <Check className="size-4.5" />
                    ) : (
                      <Copy className="size-4.5" />
                    )}
                  </button>
                  <a
                    href={`/studio/${prompt.id}${!prompt.is_public ? "?private=true" : ""}`}
                    className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-cyan-400 transition-colors flex items-center justify-center"
                    title="Edit"
                  >
                    <ArrowRight className="size-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
