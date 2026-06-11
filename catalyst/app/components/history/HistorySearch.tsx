"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  X,
  SlidersHorizontal,
  Trash2,
  Loader2,
  Star,
} from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import HistoryFilters from "./HistoryFilters";
import { supabase } from "../../lib/supabase";

interface HistorySearchProps {
  onClearHistory: () => void;
  itemsCount: number;
}

export default function HistorySearch({
  onClearHistory,
  itemsCount,
}: HistorySearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const isFavoritesOnly = searchParams.get("favorites") === "true";

  const activeFilterCount = [
    searchParams.get("tags"),
    searchParams.get("icons"),
    searchParams.get("models"),
    searchParams.get("sort") !== "newest" ? searchParams.get("sort") : null,
    isFavoritesOnly ? "favorites" : null,
  ].filter(Boolean).length;

  const toggleFavoritesOnly = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (isFavoritesOnly) {
      params.delete("favorites");
    } else {
      params.set("favorites", "true");
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (searchTerm === currentQ) return;

    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm) {
        params.set("q", searchTerm);
      } else {
        params.delete("q");
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, pathname, router, searchParams]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("history-search-input")?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const clearHistory = async () => {
    if (
      confirm(
        "Are you sure you want to clear your entire history? This cannot be undone.",
      )
    ) {
      setIsDeletingAll(true);
      try {
        const { error } = await supabase.from("prompts").delete();
        if (error) throw error;
        onClearHistory();
        router.refresh();
      } catch (err) {
        console.error("Error clearing history:", err);
      } finally {
        setIsDeletingAll(false);
      }
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="flex flex-1  group gap-2">
          <div className="flex w-full items-center rounded-2xl h-14 bg-white/5 border border-white/10 overflow-hidden px-5 transition-all duration-300 focus-within:border-cyan-500/50 focus-within:bg-white/10 focus-within:shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <Search className="size-5 text-cyan-400 mr-4" />
            <input
              id="history-search-input"
              className="w-full bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 text-lg focus:outline-none"
              placeholder="Search your history for keywords, models, or labels..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="hidden sm:flex text-[10px] text-slate-500 border border-white/10 rounded-lg px-2 py-1 font-black tracking-tighter">
              ⌘K
            </div>
          </div>

          <button
            onClick={toggleFavoritesOnly}
            className={`h-14 px-6 rounded-2xl bg-white/5 border flex items-center gap-3 transition-all active:scale-95 duration-200 ${
              isFavoritesOnly
                ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.15)]"
                : "border-white/10 text-white hover:bg-white/10"
            }`}
            title={isFavoritesOnly ? "Show All History" : "Show Favorites Only"}
          >
            <Star
              className={`size-5 ${isFavoritesOnly ? "text-yellow-400 fill-yellow-400" : "text-slate-400 hover:text-yellow-400"}`}
            />
            <span className="text-sm font-bold uppercase tracking-wider hidden xs:inline">
              Favorites
            </span>
          </button>
        </div>

        {/* Filters & Actions */}
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className={`h-14 px-6 rounded-2xl bg-white/5 text-white hover:bg-white/10 border flex items-center gap-3 transition-all active:scale-95 ${
              isFiltersOpen
                ? "border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                : "border-white/10"
            }`}
          >
            {isFiltersOpen ? (
              <X className="size-5 text-cyan-400" />
            ) : (
              <SlidersHorizontal className="size-5 text-cyan-400" />
            )}
            <span className="text-sm font-bold uppercase tracking-wider">
              Filters
            </span>
            {activeFilterCount > 0 && (
              <span className="ml-1 w-6 h-6 rounded-full bg-cyan-500 text-[#0a0f14] text-xs font-black flex items-center justify-center animate-pulse">
                {activeFilterCount}
              </span>
            )}
          </button>

          <button
            onClick={clearHistory}
            disabled={isDeletingAll || itemsCount === 0}
            className="h-14 px-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl hover:bg-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold text-sm flex items-center gap-2 group"
            title="Clear All History"
          >
            {isDeletingAll ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Trash2 className="size-5 group-hover:scale-110 transition-transform" />
            )}
            <span className="hidden sm:inline">Clear History</span>
          </button>
        </div>
      </div>

      <HistoryFilters
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
      />
    </>
  );
}
