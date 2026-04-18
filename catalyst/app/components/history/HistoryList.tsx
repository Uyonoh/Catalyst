"use client";

import React, { useState, useEffect } from "react";
import HistoryCard, { HistoryItem } from "./HistoryCard";
import { HelpCircle } from "lucide-react";
import HistorySearch from "./HistorySearch";

interface HistoryListProps {
  initialItems: HistoryItem[];
}

export default function HistoryList({ initialItems }: HistoryListProps) {
  const [items, setItems] = useState<HistoryItem[]>(initialItems);

  // Still need to update items if initialItems changes (e.g. on filter change from parent)
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleDelete = (id: string) => {
    setItems((prev: HistoryItem[]) => prev.filter((item: HistoryItem) => item.id !== id));
  };

  const handleClear = () => {
    setItems([]);
  };

  return (
    <div className="flex flex-col gap-8">
      <HistorySearch onClearHistory={handleClear} itemsCount={items.length} />

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[1fr] animate-slideUp">
          {items.map((item, idx) => (
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
            No history found
          </h2>
          <p className="text-slate-500 mb-8 max-w-sm">
            We couldn't find any prompts matching your current filters or search terms. Try adjusting them or start fresh in the Studio.
          </p>
          <a 
            href="/studio" 
            className="px-8 py-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl hover:bg-cyan-500/20 active:scale-95 transition-all font-black text-lg shadow-[0_0_20px_rgba(6,182,212,0.1)]"
          >
            Head to Studio
          </a>
        </div>
      )}
    </div>
  );
}

