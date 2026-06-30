"use client";

import React from "react";

interface AspectRatioSelectorProps {
  selected: string;
  onChange: (ratio: string) => void;
}

const ASPECT_RATIOS = [
  { value: "1:1", label: "1:1", desc: "Square" },
  { value: "16:9", label: "16:9", desc: "Landscape" },
  { value: "9:16", label: "9:16", desc: "Portrait" },
  { value: "4:3", label: "4:3", desc: "Classic" },
  { value: "3:2", label: "3:2", desc: "Photo" },
  { value: "2:3", label: "2:3", desc: "Poster" },
  { value: "21:9", label: "21:9", desc: "Ultrawide" },
];

export default function AspectRatioSelector({
  selected,
  onChange,
}: AspectRatioSelectorProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
        Aspect Ratio
      </span>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {ASPECT_RATIOS.map((item) => {
          const isSelected = item.value === selected;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange(item.value)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all duration-200 cursor-pointer active:scale-95 ${
                isSelected
                  ? "bg-primary/20 border-primary/50 text-white font-bold shadow-[0_0_10px_rgba(37,140,244,0.2)]"
                  : "bg-white/5 border-white/5 hover:border-white/10 text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="text-sm">{item.label}</span>
              <span className="text-[10px] opacity-60 font-medium scale-90">{item.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
