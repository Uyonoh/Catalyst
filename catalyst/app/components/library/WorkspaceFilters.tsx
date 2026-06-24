"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Check,
  Filter,
  SortDesc,
  Globe,
  Users,
  Eye,
} from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface WorkspaceFiltersProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WorkspaceFilters({
  isOpen,
  onClose,
}: WorkspaceFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [visibility, setVisibility] = useState<string>("all");
  const [sort, setSort] = useState<string>("newest");

  // Sync with URL on mount or URL change
  useEffect(() => {
    if (!isOpen) return;

    const vis = searchParams.get("visibility") || "all";
    const s = searchParams.get("sort") || "newest";

    setVisibility(vis);
    setSort(s);
  }, [isOpen, searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (visibility !== "all") {
      params.set("visibility", visibility);
    } else {
      params.delete("visibility");
    }

    if (sort !== "newest") {
      params.set("sort", sort);
    } else {
      params.delete("sort");
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    onClose();
  };

  const clearAll = () => {
    setVisibility("all");
    setSort("newest");

    const params = new URLSearchParams(searchParams.toString());
    params.delete("visibility");
    params.delete("sort");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer / Panel */}
      <div
        className={`fixed inset-x-0 bottom-0 bg-[#0a0f14] border-t border-white/10 rounded-t-3xl z-[101] md:relative md:inset-auto md:bg-transparent md:border-none md:rounded-none md:z-0 md:mb-8 transition-transform duration-300 transform ${
          isOpen ? "translate-y-0" : "translate-y-full md:translate-y-0"
        }`}
      >
        <div className="max-h-[85vh] overflow-y-auto dropdown-scroll md:max-h-none md:overflow-visible">
          <div className="p-6 md:p-8 glass-panel border border-white/10 md:rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <Filter className="size-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Workspace Filters
                  </h2>
                  <p className="text-slate-500 text-xs">
                    Refine community and public workspaces
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearAll}
                  className="text-xs font-medium text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
                >
                  Clear All
                </button>
                <button
                  onClick={onClose}
                  className="size-10 rounded-full hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors md:hidden"
                >
                  <X className="size-6" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Visibility Section */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Eye className="size-3.5" /> Visibility
                </label>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "All Workspaces", value: "all", icon: Eye },
                    { label: "Public Only", value: "public", icon: Globe },
                    { label: "Community Only", value: "community", icon: Users },
                  ].map((option) => {
                    const IconComponent = option.icon;
                    const isSelected = visibility === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setVisibility(option.value)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all border ${
                          isSelected
                            ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 font-semibold"
                            : "text-slate-400 border-transparent hover:bg-white/5"
                        }`}
                      >
                        <IconComponent className="size-4" />
                        <span className="text-sm font-medium">{option.label}</span>
                        {isSelected && <Check className="size-4 ml-auto text-cyan-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sort Section */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <SortDesc className="size-3.5" /> Sort By
                </label>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Newest First", value: "newest" },
                    { label: "Oldest First", value: "oldest" },
                    { label: "Alphabetical (A-Z)", value: "title" },
                  ].map((option) => {
                    const isSelected = sort === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setSort(option.value)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all border ${
                          isSelected
                            ? "bg-white text-[#101922] border-white font-bold"
                            : "text-slate-400 border-transparent hover:bg-white/5"
                        }`}
                      >
                        <span className="text-sm font-medium">
                          {option.label}
                        </span>
                        {isSelected && <Check className="size-4" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-end gap-3 sticky bottom-0 bg-[#0a0f14] md:bg-transparent">
              <button
                onClick={onClose}
                className="px-6 h-12 rounded-xl text-slate-400 font-medium hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={applyFilters}
                className="px-8 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/20 hover:opacity-90 active:scale-95 transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
