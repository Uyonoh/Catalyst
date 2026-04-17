"use client";

import React, { useState, useEffect } from "react";
import { Search, ListFilter, Plus, X, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import LibraryFilters from "./LibraryFilters";

export default function LibrarySearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const activeFilterCount = [
    searchParams.get("modes"),
    searchParams.get("tags"),
    searchParams.get("tag"),
    searchParams.get("models"),
    searchParams.get("sort") !== "newest" ? searchParams.get("sort") : null
  ].filter(Boolean).length;

  const hasFilters = activeFilterCount > 0 || !!searchTerm;

  const scrollToSearch = () => {
    const el = document.getElementById("search-section");
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (searchTerm === currentQ) return; // Prevent infinite loop

    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm) {
        params.set("q", searchTerm);
      } else {
        params.delete("q");
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
      if (searchTerm) scrollToSearch();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, pathname, router, searchParams]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("library-search-input")?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div id="search-section" className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Search */}
        <div className="flex-1 group">
          <div className="flex w-full items-center rounded-xl h-12 glass-panel border border-white/10 overflow-hidden px-4 transition-all duration-300 focus-within:border-cyan-500/50 focus-within:shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Search className="size-5 text-cyan-400 mr-3" />
            <input
              id="library-search-input"
              className="w-full bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 text-base focus:outline-none"
              placeholder="Search your library for keywords, models, or tags..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="hidden sm:flex text-xs text-slate-500 border border-white/10 rounded px-2 py-0.5 font-mono">
              ⌘K
            </div>
          </div>
        </div>
        {/* Sort/View Options */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className={`h-12 px-4 rounded-xl glass-panel text-white hover:bg-white/10 border flex items-center gap-2 transition-all active:scale-95 ${
              isFiltersOpen ? "border-cyan-500/50 bg-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.2)]" : "border-white/10"
            }`}
          >
            {isFiltersOpen ? <X className="size-5 text-cyan-400" /> : <SlidersHorizontal className="size-5 text-cyan-400" />}
            <span className="text-sm font-medium">Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-cyan-500 text-[#101922] text-[10px] font-bold flex items-center justify-center animate-pulse">
                {activeFilterCount}
              </span>
            )}
          </button>
          <button
            className="h-12 w-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white flex items-center justify-center hover:opacity-90 transition-all shadow-lg hover:shadow-cyan-500/20 active:scale-95"
            title="Create New Prompt"
            onClick={() => router.push("/studio")}
          >
            <Plus className="size-6 font-bold" />
          </button>
        </div>
      </div>

      <LibraryFilters isOpen={isFiltersOpen} onClose={() => setIsFiltersOpen(false)} />
    </>
  );
}
