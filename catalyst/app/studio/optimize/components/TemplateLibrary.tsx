"use client";

import React from "react";
import { BookOpen } from "lucide-react";
import { templateLibrary } from "../data/templateLibrary";
import { FieldsState } from "../hooks/usePromptBuilder";
import GlassPanel from "../../../components/GlassPanel";

interface TemplateLibraryProps {
  onApplyTemplate: (fields: Partial<FieldsState>) => void;
  onNotify: (msg: string, type: "success" | "info" | "error") => void;
}

export default function TemplateLibrary({
  onApplyTemplate,
  onNotify,
}: TemplateLibraryProps) {
  return (
    <GlassPanel className="p-4 flex flex-col gap-3">
      <div className="flex items-center gap-1.5 border-b border-white/10 pb-2">
        <BookOpen className="size-4 text-cyan-400" />
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          Style Templates
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto dropdown-scroll">
        {templateLibrary.map((template) => (
          <button
            key={template.id}
            onClick={() => {
              onApplyTemplate(template.fields);
              onNotify(`Applied "${template.name}" template`, "success");
            }}
            className="flex flex-col text-left p-2.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer group active:scale-98"
          >
            <span className="text-[11px] font-bold text-white group-hover:text-cyan-400 transition-colors">
              {template.name}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 leading-tight line-clamp-2">
              {template.description}
            </span>
          </button>
        ))}
      </div>
    </GlassPanel>
  );
}
