"use client";

import React, { useState } from "react";
import { Save, FolderOpen, Trash } from "lucide-react";
import { usePresets } from "../hooks/usePresets";
import { FieldsState } from "../hooks/usePromptBuilder";
import GlassPanel from "../../../components/GlassPanel";

interface PresetsPanelProps {
  currentFields: FieldsState;
  onApplyPreset: (fields: FieldsState) => void;
  onNotify: (msg: string, type: "success" | "info" | "error") => void;
}

export default function PresetsPanel({
  currentFields,
  onApplyPreset,
  onNotify,
}: PresetsPanelProps) {
  const { presets, savePreset, deletePreset } = usePresets();
  const [name, setName] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    savePreset(name, currentFields);
    onNotify(`Preset "${name.trim()}" saved!`, "success");
    setName("");
  };

  return (
    <GlassPanel className="p-4 flex flex-col gap-3">
      <div className="flex items-center gap-1.5 border-b border-white/10 pb-2">
        <FolderOpen className="size-4 text-cyan-400" />
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          Presets & Presets
        </h3>
      </div>

      {/* Save form */}
      <form onSubmit={handleSave} className="flex gap-2">
        <input
          type="text"
          placeholder="Preset name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 px-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
        />
        <button
          type="submit"
          className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-black font-black text-xs rounded-xl flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
        >
          <Save className="size-3" />
          Save
        </button>
      </form>

      {/* Presets list */}
      <div className="flex flex-col gap-1 max-h-[160px] overflow-y-auto dropdown-scroll">
        {presets.length === 0 ? (
          <span className="text-[11px] text-slate-500 italic py-2">
            No presets saved yet.
          </span>
        ) : (
          presets.map((preset) => (
            <div
              key={preset.id}
              className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 group transition-all"
            >
              <button
                onClick={() => {
                  onApplyPreset(preset.fields);
                  onNotify(`Preset "${preset.name}" applied`, "info");
                }}
                className="text-[11px] font-bold text-slate-300 hover:text-white text-left truncate flex-1 cursor-pointer"
              >
                {preset.name}
              </button>
              <button
                onClick={() => {
                  deletePreset(preset.id);
                  onNotify(`Preset deleted`, "info");
                }}
                className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-white/10 text-rose-400 hover:text-rose-300 transition-all cursor-pointer"
              >
                <Trash className="size-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </GlassPanel>
  );
}
