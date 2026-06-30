"use client";

import React from "react";
import { Plus, Check } from "lucide-react";

interface Tag {
  id: string;
  label: string;
  phrase: string;
}

interface QuickTagTogglesProps {
  tags?: Tag[];
  fieldValue: string;
  onChange: (newValue: string) => void;
}

const DEFAULT_TAGS: Tag[] = [
  { id: "mood_melancholic", label: "Melancholic", phrase: "melancholic" },
  { id: "mood_euphoric", label: "Euphoric", phrase: "euphoric" },
  { id: "mood_tense", label: "Tense", phrase: "tense" },
  { id: "mood_serene", label: "Serene", phrase: "serene" },
  { id: "mood_gritty", label: "Gritty", phrase: "gritty" },
  { id: "mood_dreamy", label: "Dreamy", phrase: "dreamy" },
  { id: "mood_cinematic", label: "Cinematic", phrase: "cinematic" },
  { id: "mood_futuristic", label: "Futuristic", phrase: "futuristic" },
];

export default function QuickTagToggles({
  tags = DEFAULT_TAGS,
  fieldValue,
  onChange,
}: QuickTagTogglesProps) {
  // Parse currently active phrases in the mood text field
  const currentTags = fieldValue
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 0);

  const handleToggle = (tag: Tag) => {
    const phraseLower = tag.phrase.toLowerCase().trim();
    const isActive = currentTags.includes(phraseLower);

    let updatedTags: string[];
    if (isActive) {
      // Remove it
      updatedTags = currentTags.filter((t) => t !== phraseLower);
    } else {
      // Add it
      updatedTags = [...currentTags, phraseLower];
    }

    // Join back comma-separated
    onChange(updatedTags.join(", "));
  };

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {tags.map((tag) => {
        const isActive = currentTags.includes(tag.phrase.toLowerCase().trim());
        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => handleToggle(tag)}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-full border transition-all cursor-pointer select-none active:scale-95 ${
              isActive
                ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-400 font-bold"
                : "bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {isActive ? <Check className="size-3" /> : <Plus className="size-3" />}
            {tag.label}
          </button>
        );
      })}
    </div>
  );
}
