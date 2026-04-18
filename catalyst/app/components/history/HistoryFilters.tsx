"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Check,
  Filter,
  SortDesc,
  Box,
  LayoutGrid,
  CheckSquare,
  Square,
} from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCatalog } from "../../context/CatalogContext";

interface HistoryFiltersProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HistoryFilters({
  isOpen,
  onClose,
}: HistoryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { categories, models } = useCatalog();

  const [selectedModes, setSelectedModes] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedIcons, setSelectedIcons] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [sort, setSort] = useState<string>("newest");

  // Sync with URL on mount or URL change
  useEffect(() => {
    if (!isOpen) return;

    const modes = searchParams.get("modes")?.split(",").filter(Boolean) || [];
    const tags = searchParams.get("tags")?.split(",").filter(Boolean) || [];
    const icons = searchParams.get("icons")?.split(",").filter(Boolean) || [];
    const mdls = searchParams.get("models")?.split(",").filter(Boolean) || [];
    const s = searchParams.get("sort") || "newest";

    setSelectedModes(modes);
    setSelectedTags(tags);
    setSelectedIcons(icons);
    setSelectedModels(mdls);
    setSort(s);
  }, [isOpen, searchParams]);

  const toggleItem = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    item: string,
  ) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedModes.length > 0) params.set("modes", selectedModes.join(","));
    else params.delete("modes");

    if (selectedTags.length > 0) params.set("tags", selectedTags.join(","));
    else params.delete("tags");

    if (selectedIcons.length > 0) params.set("icons", selectedIcons.join(","));
    else params.delete("icons");

    if (selectedModels.length > 0)
      params.set("models", selectedModels.join(","));
    else params.delete("models");

    if (sort !== "newest") params.set("sort", sort);
    else params.delete("sort");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    onClose();
  };

  const clearAll = () => {
    setSelectedModes([]);
    setSelectedTags([]);
    setSelectedIcons([]);
    setSelectedModels([]);
    setSort("newest");

    const params = new URLSearchParams(searchParams.toString());
    params.delete("modes");
    params.delete("tags");
    params.delete("icons");
    params.delete("models");
    params.delete("sort");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Drawer / Panel */}
      <div
        className={`fixed inset-x-0 bottom-0 bg-[#0a0f14] border-t border-white/10 rounded-t-3xl z-[101] md:relative md:inset-auto md:bg-transparent md:border-none md:rounded-none md:z-0 transition-transform duration-300 transform ${isOpen ? "translate-y-0" : "translate-y-full md:translate-y-0"}`}
      >
        <div className="max-h-[85vh] overflow-y-auto dropdown-scroll md:max-h-none md:overflow-visible">
          <div className="p-6 md:p-8 glass-panel border border-white/10 md:rounded-2xl shadow-2xl bg-slate-900/40 backdrop-blur-md">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <Filter className="size-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    History Filters
                  </h2>
                  <p className="text-slate-500 text-xs">
                    Narrow down your past prompts
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Modality Section */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Box className="size-3.5" /> Modality
                </label>
                <div className="flex flex-col gap-2">
                  {["Text", "Image", "Video"].map((mode) => (
                    <button
                      key={mode}
                      onClick={() =>
                        toggleItem(
                          selectedModes,
                          setSelectedModes,
                          mode.toLowerCase(),
                        )
                      }
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                        selectedModes.includes(mode.toLowerCase())
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                          : "text-slate-400 hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      {selectedModes.includes(mode.toLowerCase()) ? (
                        <CheckSquare className="size-4" />
                      ) : (
                        <Square className="size-4" />
                      )}
                      <span className="text-sm font-medium">{mode}</span>
                    </button>
                  ))}
                </div>
              </div>
              {/* Categories & Tags Section */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <LayoutGrid className="size-3.5" /> Tag & Category
                </label>
                <div className="grid grid-cols-1 gap-1 max-h-[250px] overflow-y-auto dropdown-scroll pr-2">
                  {/* Database Categories */}
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() =>
                        toggleItem(selectedIcons, setSelectedIcons, cat.slug)
                      }
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-left ${
                        selectedIcons.includes(cat.slug)
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                          : "text-slate-400 hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      {selectedIcons.includes(cat.slug) ? (
                        <CheckSquare className="size-4" />
                      ) : (
                        <Square className="size-4" />
                      )}
                      <span className="text-sm font-medium truncate">
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Models Section */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Box className="size-3.5" /> Target Model
                </label>
                <div className="grid grid-cols-1 gap-1 max-h-[250px] overflow-y-auto dropdown-scroll pr-2">
                  {models.map((mod) => (
                    <button
                      key={mod.id}
                      onClick={() =>
                        toggleItem(selectedModels, setSelectedModels, mod.slug)
                      }
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-left ${
                        selectedModels.includes(mod.slug)
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                          : "text-slate-400 hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      {selectedModels.includes(mod.slug) ? (
                        <CheckSquare className="size-4" />
                      ) : (
                        <Square className="size-4" />
                      )}
                      <span className="text-sm font-medium truncate">
                        {mod.name}
                      </span>
                    </button>
                  ))}
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
                    { label: "Alphabetical", value: "title" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSort(option.value)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                        sort === option.value
                          ? "bg-white text-[#101922] font-bold"
                          : "text-slate-400 hover:bg-white/5"
                      }`}
                    >
                      <span className="text-sm font-medium">
                        {option.label}
                      </span>
                      {sort === option.value && <Check className="size-4" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Bottom (Mobile) / Footer */}
            <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-end gap-3 sticky bottom-0 bg-[#0a0f14]/80 backdrop-blur-md md:bg-transparent">
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
