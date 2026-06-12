"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Sparkles, Folder } from "lucide-react";

export default function LibraryViewToggle() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentView =
    searchParams.get("view") === "workspaces" ? "workspaces" : "prompts";

  const handleToggle = (view: "prompts" | "workspaces") => {
    if (view === currentView) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    params.set("page", "1"); // Reset to page 1

    if (view === "workspaces") {
      // Clear prompt-specific filters
      params.delete("tag");
      params.delete("tags");
      params.delete("icon");
      params.delete("icons");
      params.delete("models");
      params.delete("modes");
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex justify-center mb-8">
      <div className="relative flex items-center p-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-lg">
        {/* Sliding background indicator */}
        <div
          className={`absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-10px)] bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl transition-all duration-350 ease-out ${
            currentView === "workspaces"
              ? "transform translate-x-[calc(100%+6px)]"
              : ""
          }`}
        />

        {/* Prompts Tab */}
        <button
          onClick={() => handleToggle("prompts")}
          className={`relative z-10 flex-1 py-3 text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
            currentView === "prompts"
              ? "text-cyan-400 font-extrabold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Sparkles
            className={`size-4 transition-transform duration-300 ${currentView === "prompts" ? "scale-110 rotate-12 text-cyan-400" : "text-slate-400"}`}
          />
          <span>Optimized Prompts</span>
        </button>

        {/* Workspaces Tab */}
        <button
          onClick={() => handleToggle("workspaces")}
          className={`relative z-10 flex-1 py-3 text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
            currentView === "workspaces"
              ? "text-cyan-400 font-extrabold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Folder
            className={`size-4 transition-transform duration-300 ${currentView === "workspaces" ? "scale-110 text-cyan-400" : "text-slate-400"}`}
          />
          <span>Workspaces</span>
        </button>
      </div>
    </div>
  );
}
