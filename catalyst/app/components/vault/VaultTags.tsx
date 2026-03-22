import React from "react";

const TAGS = [
  {
    label: "All Prompts",
    color: "bg-white",
    text: "text-[#101922]",
    active: true,
  },
  { label: "#Creative", color: "bg-cyan-400", active: false },
  { label: "#Coding", color: "bg-green-400", active: false },
  { label: "#Marketing", color: "bg-purple-400", active: false },
  { label: "#Data Analysis", color: "bg-orange-400", active: false },
  { label: "#Writing", color: "bg-primary", active: false },
];

export default function VaultTags() {
  return (
    <div className="flex gap-3 mb-8 overflow-x-auto pb-2 dropdown-scroll">
      {TAGS.map((tag) => {
        if (tag.active && tag.label === "All Prompts") {
          return (
            <button
              key={tag.label}
              className="whitespace-nowrap h-8 px-4 rounded-full bg-white text-[#101922] text-xs font-bold shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-transform active:scale-95"
            >
              {tag.label}
            </button>
          );
        }

        const borderHover = tag.color
          .replace("bg-", "hover:border-")
          .replace("-400", "-400/50")
          .replace("primary", "primary/50");

        return (
          <button
            key={tag.label}
            className={`whitespace-nowrap h-8 px-4 rounded-full glass-panel border border-white/10 text-slate-300 hover:text-white ${borderHover} text-xs font-medium transition-all flex items-center gap-1.5 active:scale-95`}
          >
            <span className={`w-2 h-2 rounded-full ${tag.color}`}></span>
            {tag.label}
          </button>
        );
      })}
    </div>
  );
}
