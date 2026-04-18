"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const TAGS = [
  { label: "All Prompts", color: "bg-white", text: "text-[#101922]" },
  { label: "#Creative", color: "bg-cyan-400" },
  { label: "#Coding", color: "bg-green-400" },
  { label: "#Marketing", color: "bg-purple-400" },
  { label: "#Data Analysis", color: "bg-orange-400" },
  { label: "#Writing", color: "bg-blue-400" },
];

export default function LibraryTags() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentTag = searchParams.get("tag");
  const currentTags = searchParams.get("tags")?.split(",").filter(Boolean) || (currentTag ? [currentTag] : []);
  const currentIcons = searchParams.get("icons")?.split(",").filter(Boolean) || (searchParams.get("icon") ? [searchParams.get("icon")] : []);

  const handleTagClick = (label: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (label === "All Prompts") {
      params.delete("tag");
      params.delete("tags");
      params.delete("icon");
      params.delete("icons");
    } else {
      if (currentTags.includes(label)) {
        const newTags = currentTags.filter(t => t !== label);
        if (newTags.length > 0) params.set("tags", newTags.join(","));
        else {
          params.delete("tags");
          params.delete("tag");
        }
      } else {
        const newTags = [...currentTags, label];
        params.set("tags", newTags.join(","));
        params.delete("tag");
      }
    }
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    
    setTimeout(() => {
      const el = document.getElementById("search-section");
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 50);
  };

  return (
    <div className="flex gap-3 mb-8 overflow-x-auto pb-2 dropdown-scroll animate-fadeIn">
      {TAGS.map((tag) => {
        const isActive = tag.label === "All Prompts" 
          ? currentTags.length === 0 && currentIcons.length === 0
          : currentTags.includes(tag.label);

        if (tag.label === "All Prompts") {
          return (
            <button
              key={tag.label}
              onClick={() => handleTagClick(tag.label)}
              className={`whitespace-nowrap h-8 px-4 rounded-full text-xs font-bold transition-transform active:scale-95 ${
                isActive 
                  ? "bg-white text-[#101922] shadow-[0_0_10px_rgba(255,255,255,0.3)]" 
                  : "glass-panel border border-white/10 text-slate-300 hover:text-white hover:border-cyan-500/30 font-medium"
              }`}
            >
              {tag.label}
            </button>
          );
        }

        return (
          <button
            key={tag.label}
            onClick={() => handleTagClick(tag.label)}
            className={`whitespace-nowrap h-8 px-4 rounded-full glass-panel border transition-all flex items-center gap-1.5 active:scale-95 text-xs font-medium ${
              isActive
                ? "border-cyan-500/50 bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                : "border-white/10 text-slate-300 hover:text-white hover:border-cyan-500/30"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${tag.color} ${isActive ? "shadow-[0_0_8px_currentColor]" : ""}`}></span>
            {tag.label}
          </button>
        );
      })}
    </div>
  );
}
