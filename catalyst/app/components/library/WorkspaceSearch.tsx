"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, X, SlidersHorizontal, Globe, Users, Eye } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import WorkspaceFilters from "./WorkspaceFilters";

export default function WorkspaceSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Visibility is 'all' by default, or read from url
  const currentVisibility = searchParams.get("visibility") || "all";

  const activeFilterCount = [
    searchParams.get("visibility") ? "visibility" : null,
    searchParams.get("sort") && searchParams.get("sort") !== "newest" ? "sort" : null,
  ].filter(Boolean).length;

  const scrollToSearch = () => {
    const el = document.getElementById("search-section");
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Debounced search logic
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
      if (searchTerm) scrollToSearch();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, pathname, router, searchParams]);

  // Focus search input on Ctrl/Cmd + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("workspace-search-input")?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Quick visibility toggle handler
  const handleVisibilityChange = (vis: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (vis === "all") {
      params.delete("visibility");
    } else {
      params.set("visibility", vis);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <div id="search-section" className="flex flex-col gap-3 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="flex-1 group">
            <div className="flex w-full items-center rounded-xl h-12 glass-panel border border-white/10 overflow-hidden px-4 transition-all duration-300 focus-within:border-cyan-500/50 focus-within:shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Search className="size-5 text-cyan-400 mr-3 shrink-0" />
              <input
                id="workspace-search-input"
                className="w-full bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 text-base focus:outline-none"
                placeholder="Search workspaces by name or description..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="hidden sm:flex text-xs text-slate-500 border border-white/10 rounded px-2 py-0.5 font-mono shrink-0">
                ⌘K
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2 shrink-0 justify-end sm:justify-start">
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
              title="Create New Workspace"
              onClick={() => router.push("/")}
            >
              <Plus className="size-6 font-bold" />
            </button>
          </div>
        </div>

        {/* Quick Filter Chips (Mobile-First / Tabbed Layout) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {[
            { label: "All", value: "all", icon: Eye },
            { label: "Public", value: "public", icon: Globe },
            { label: "Community", value: "community", icon: Users },
          ].map((chip) => {
            const Icon = chip.icon;
            const isSelected = currentVisibility === chip.value;
            return (
              <button
                key={chip.value}
                onClick={() => handleVisibilityChange(chip.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                  isSelected
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                    : "bg-white/5 text-slate-400 border-white/5 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="size-3.5" />
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      <WorkspaceFilters isOpen={isFiltersOpen} onClose={() => setIsFiltersOpen(false)} />
    </>
  );
}
