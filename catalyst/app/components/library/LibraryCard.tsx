"use client";

import React, { useState, useEffect } from "react";
import GlassPanel from "../GlassPanel";
import { Star, Copy, Check, Edit, Globe, Users, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  PROMPT_TYPE_TOKENS,
  PROMPT_TYPE_FALLBACK,
  MODEL_BADGE_TOKENS,
  MODEL_BADGE_FALLBACK,
} from "../../lib/promptTokens";
import { useUser } from "../../context/AuthContext";
import { toggleFavoritePrompt, checkPromptFavoriteStatus } from "../../lib/prompts-client";

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
  user_id?: string;
  is_favorite?: boolean;
  isWorkspace?: boolean;
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
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const { user } = useUser();
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (user && item && !item.isWorkspace) {
      checkPromptFavoriteStatus(user.id, item).then(setIsFavorited).catch(console.error);
    }
  }, [user, item]);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    try {
      const { action } = await toggleFavoritePrompt(user.id, item);
      setIsFavorited(action === "favorited" || action === "duplicated");
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

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

  const handleCardClick = () => {
    if (item.isWorkspace) {
      router.push(`/workspace/${item.id}`);
    } else {
      router.push(`/studio/${item.id}`);
    }
  };

  return (
    <GlassPanel
      hoverable
      className="p-5 flex flex-col gap-4 group cursor-pointer relative overflow-hidden active:scale-[0.98] transition-all h-full"
      onClick={handleCardClick}
    >
      {item.has_gradient && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-bl-full -mr-4 -mt-4 transition-opacity opacity-50 group-hover:opacity-100" />
      )}
      <div className="flex justify-between items-start z-10">
        <div className="flex items-center gap-3">
          {item.isWorkspace ? (
            <div
              className={`size-10 rounded-lg ${
                item.icon === "users"
                  ? "bg-purple-500/10 border-purple-500/20 text-purple-400"
                  : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              } flex items-center justify-center border group-hover:scale-110 transition-transform`}
            >
              {item.icon === "users" ? (
                <Users className="size-5" />
              ) : (
                <Globe className="size-5" />
              )}
            </div>
          ) : (
            (() => {
              const token = PROMPT_TYPE_TOKENS[item.icon] || PROMPT_TYPE_FALLBACK;
              const { Icon } = token;
              return (
                <div
                  className={`size-10 rounded-lg ${token.bg} flex items-center justify-center ${token.text} border ${token.border} group-hover:scale-110 transition-transform`}
                >
                  <Icon className="size-5" />
                </div>
              );
            })()
          )}
          <div>
            <h3 className="text-white font-bold leading-tight group-hover:text-cyan-400 transition-colors">
              {item.title}
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Updated {formatUpdated(item.updated_at)}
            </p>
          </div>
        </div>
        
        {item.isWorkspace ? (
          <div className="text-slate-500 group-hover:text-cyan-400 transition-colors">
            <ArrowUpRight className="size-5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
        ) : (
          <button
            onClick={handleFavorite}
            className={`transition-colors duration-200 ${isFavorited ? "text-yellow-400" : "text-slate-500 hover:text-yellow-400"}`}
            aria-label="Favourite"
          >
            <Star className={`size-5 ${isFavorited ? "fill-yellow-400" : ""}`} />
          </button>
        )}
      </div>
      <div className="h-[1px] w-full bg-white/5" />
      <p className="text-slate-300 text-sm leading-relaxed line-clamp-3 font-mono opacity-80 code-preview p-2 rounded border border-white/10 bg-white/5">
        {item.snippet}
      </p>
      <div className="mt-auto pt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {(() => {
            const token =
              MODEL_BADGE_TOKENS[item.model_color] || MODEL_BADGE_FALLBACK;
            return (
              <span
                className={`px-2 py-1 rounded ${token.bg} border ${token.border} text-[10px] font-semibold ${token.text} uppercase tracking-wide`}
              >
                {item.model}
              </span>
            );
          })()}
          <span className="text-slate-500 text-xs font-medium">{item.tag}</span>
        </div>
        {!item.isWorkspace && (
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
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-cyan-400 transition-colors flex items-center justify-center"
              title="Edit"
            >
              <Edit className="size-5" />
            </a>
          </div>
        )}
      </div>
    </GlassPanel>
  );
}
