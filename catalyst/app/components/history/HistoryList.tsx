"use client";

import React, { useState, useMemo } from "react";
import HistoryCard, { HistoryItem } from "./HistoryCard";
import { Search, Loader2, Filter, Trash2, HelpCircle } from "lucide-react";
import GlassPanel from "../GlassPanel";
import { supabase } from "../../lib/supabase";

interface HistoryListProps {
  initialItems: HistoryItem[];
}

export default function HistoryList({ initialItems }: HistoryListProps) {
  const [items, setItems] = useState<HistoryItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const searchStr = (
        (item.title || "") + 
        (item.content || "") + 
        (item.raw_input || "") + 
        (item.target_model || "")
      ).toLowerCase();
      return searchStr.includes(searchQuery.toLowerCase());
    });
  }, [items, searchQuery]);

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearHistory = async () => {
    if (confirm("Are you sure you want to clear your entire history? This cannot be undone.")) {
      setIsDeletingAll(true);
      try {
        const { error } = await supabase.from("prompts").delete();
        if (error) throw error;
        setItems([]);
      } catch (err) {
        console.error("Error clearing history:", err);
        setIsDeletingAll(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Filters row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 animate-fadeIn">
        <label htmlFor="history-search" className="sr-only">Search your prompt history</label>
        <div className="relative w-full md:max-w-md group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors pointer-events-none">
            <Search className="size-5" />
          </div>
          <input
            id="history-search"
            type="text"
            placeholder="Search your prompt history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={clearHistory}
            disabled={isDeletingAll || items.length === 0}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold text-sm"
          >
            {isDeletingAll ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
            Clear History
          </button>
          
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 text-slate-400 rounded-xl hover:bg-white/10 transition-all font-bold text-sm">
            <Filter className="size-4" />
            Filter
          </button>
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[1fr] animate-slideUp">
          {filteredItems.map((item, idx) => (
            <div 
              key={item.id} 
              className="animate-in fade-in slide-in-from-bottom-4 duration-500" 
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <HistoryCard item={item} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-20 rounded-3xl flex flex-col items-center justify-center text-center animate-slideUp border border-dashed border-white/10">
          <div className="size-24 rounded-full bg-white/5 flex items-center justify-center mb-6 relative group">
            <HelpCircle className="size-12 text-slate-500 group-hover:text-cyan-400 group-hover:scale-110 transition-all" />
            <div className="absolute inset-0 bg-cyan-500/10 rounded-full animate-ping scale-0 group-hover:scale-100 opacity-20" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {searchQuery ? "No matches found" : "No history yet"}
          </h2>
          <p className="text-slate-500 mb-8 max-w-sm">
            {searchQuery 
              ? `We couldn't find any prompts matching "${searchQuery}". Try a different search term.` 
              : "Your prompt history is empty. Start using the Studio to build your collection."}
          </p>
          {!searchQuery && (
            <a 
              href="/studio" 
              className="px-8 py-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl hover:bg-cyan-500/20 active:scale-95 transition-all font-black text-lg shadow-[0_0_20px_rgba(6,182,212,0.1)]"
            >
              Head to Studio
            </a>
          )}
        </div>
      )}
    </div>
  );
}
