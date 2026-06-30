"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, Eye, RefreshCw, Sparkles } from "lucide-react";
import { FieldsState } from "../hooks/usePromptBuilder";
import QuickTagToggles from "./QuickTagToggles";
import AspectRatioSelector from "./AspectRatioSelector";
import OptionPickerModal from "./OptionPickerModal";
import { lightingOptions } from "../data/lightingOptions";

interface PromptBuilderFormProps {
  fields: FieldsState;
  onChangeField: (key: keyof FieldsState, value: string) => void;
  assembledPrompt: string;
  onReset: () => void;
}

export default function PromptBuilderForm({
  fields,
  onChangeField,
  assembledPrompt,
  onReset,
}: PromptBuilderFormProps) {
  // Collapsible headers expanded/collapsed state tracking (Spec #12)
  const [sections, setSections] = useState({
    scene: true,
    lightingComposition: true,
    cameraLens: true,
    metaNegative: true,
  });

  const [isLightingModalOpen, setIsLightingModalOpen] = useState(false);

  const toggleSection = (section: keyof typeof sections) => {
    setSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getLightingLabel = () => {
    if (!fields.lighting) return "No lighting chosen (Modal grid)";
    const matched = lightingOptions.find((opt) => opt.id === fields.lighting);
    return matched ? matched.name : fields.lighting;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ────────────────── SECTION 1: SCENE DEFINITION ────────────────── */}
      <div className="border border-white/10 rounded-xl overflow-hidden bg-black/10">
        <button
          type="button"
          onClick={() => toggleSection("scene")}
          className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors text-left"
        >
          <span className="text-sm font-bold text-white uppercase tracking-wider">
            1. Scene Definition & Framing
          </span>
          {sections.scene ? <ChevronDown className="size-4 text-slate-400" /> : <ChevronRight className="size-4 text-slate-400" />}
        </button>

        <div className={`panel-body p-4 flex flex-col gap-4 border-t border-white/10 ${sections.scene ? "" : "panel-body--collapsed"}`}>
          {/* Subject (long text) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Subject / Action <span className="text-rose-400">*</span>
              </label>
              <span className="text-[10px] text-slate-500 font-medium">Main subject details</span>
            </div>
            <textarea
              value={fields.subject}
              onChange={(e) => onChangeField("subject", e.target.value)}
              placeholder="E.g., A majestic white tiger sprinting through snow-covered hills under a dramatic sky"
              rows={3}
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 resize-none font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Shot Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Shot Type
              </label>
              <input
                type="text"
                value={fields.shotType}
                onChange={(e) => onChangeField("shotType", e.target.value)}
                placeholder="E.g., extreme close-up, wide shot"
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>

            {/* Camera Angle */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Camera Angle
              </label>
              <input
                type="text"
                value={fields.cameraAngle}
                onChange={(e) => onChangeField("cameraAngle", e.target.value)}
                placeholder="E.g., low-angle, birds-eye view"
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>

            {/* Environment */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Environment / Setting
              </label>
              <input
                type="text"
                value={fields.environment}
                onChange={(e) => onChangeField("environment", e.target.value)}
                placeholder="E.g., neon Tokyo alley, cyber laboratory"
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────── SECTION 2: LIGHTING & COMPOSITION ────────────────── */}
      <div className="border border-white/10 rounded-xl overflow-hidden bg-black/10">
        <button
          type="button"
          onClick={() => toggleSection("lightingComposition")}
          className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors text-left"
        >
          <span className="text-sm font-bold text-white uppercase tracking-wider">
            2. Lighting & Composition Structure
          </span>
          {sections.lightingComposition ? <ChevronDown className="size-4 text-slate-400" /> : <ChevronRight className="size-4 text-slate-400" />}
        </button>

        <div className={`panel-body p-4 flex flex-col gap-4 border-t border-white/10 ${sections.lightingComposition ? "" : "panel-body--collapsed"}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Composition Style */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Composition Style
              </label>
              <input
                type="text"
                value={fields.compositionStyle}
                onChange={(e) => onChangeField("compositionStyle", e.target.value)}
                placeholder="E.g., rule of thirds, symmetrical, leading lines"
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>

            {/* Lighting (Option Picker Modal pattern) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Lighting Source
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsLightingModalOpen(true)}
                  className="flex-1 text-left px-3 py-2 bg-black/40 hover:bg-black/60 border border-white/10 rounded-xl text-xs text-slate-300 font-semibold cursor-pointer transition-colors truncate"
                >
                  {getLightingLabel()}
                </button>
                {fields.lighting && (
                  <button
                    type="button"
                    onClick={() => onChangeField("lighting", "")}
                    className="p-2 bg-white/5 border border-white/10 hover:bg-rose-950/20 hover:border-rose-900/30 text-slate-400 hover:text-rose-400 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mood / Atmosphere + Quick Tags */}
          <div className="flex flex-col gap-1.5 mt-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Atmosphere / Mood
            </label>
            <input
              type="text"
              value={fields.mood}
              onChange={(e) => onChangeField("mood", e.target.value)}
              placeholder="Mood adjectives (comma separated or tags below)"
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            />
            {/* Quick-Tag Toggles (Spec #3) */}
            <QuickTagToggles
              fieldValue={fields.mood}
              onChange={(val) => onChangeField("mood", val)}
            />
          </div>
        </div>
      </div>

      {/* ────────────────── SECTION 3: CAMERA, LENS & FILM ────────────────── */}
      <div className="border border-white/10 rounded-xl overflow-hidden bg-black/10">
        <button
          type="button"
          onClick={() => toggleSection("cameraLens")}
          className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors text-left"
        >
          <span className="text-sm font-bold text-white uppercase tracking-wider">
            3. Photographic Hardware & Emulation
          </span>
          {sections.cameraLens ? <ChevronDown className="size-4 text-slate-400" /> : <ChevronRight className="size-4 text-slate-400" />}
        </button>

        <div className={`panel-body p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10 ${sections.cameraLens ? "" : "panel-body--collapsed"}`}>
          {/* Camera Body */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Camera Body
            </label>
            <input
              type="text"
              value={fields.cameraBody}
              onChange={(e) => onChangeField("cameraBody", e.target.value)}
              placeholder="E.g., Sony A7R V, Hasselblad"
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            />
          </div>

          {/* Focal Length */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Focal Length
            </label>
            <input
              type="text"
              value={fields.focalLength}
              onChange={(e) => onChangeField("focalLength", e.target.value)}
              placeholder="E.g., 35mm, 85mm, 200mm"
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            />
          </div>

          {/* Lens Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Lens Type
            </label>
            <input
              type="text"
              value={fields.lensType}
              onChange={(e) => onChangeField("lensType", e.target.value)}
              placeholder="E.g., anamorphic, prime lens"
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            />
          </div>

          {/* Film Stock */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Film Stock / Emulation
            </label>
            <input
              type="text"
              value={fields.filmStock}
              onChange={(e) => onChangeField("filmStock", e.target.value)}
              placeholder="E.g., Kodak Portra 400, CineStill 800T"
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            />
          </div>
        </div>
      </div>

      {/* ────────────────── SECTION 4: OUTPUT CONFIG & NEGATIVES ────────────────── */}
      <div className="border border-white/10 rounded-xl overflow-hidden bg-black/10">
        <button
          type="button"
          onClick={() => toggleSection("metaNegative")}
          className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors text-left"
        >
          <span className="text-sm font-bold text-white uppercase tracking-wider">
            4. Post-Process Aesthetic & Negative Directives
          </span>
          {sections.metaNegative ? <ChevronDown className="size-4 text-slate-400" /> : <ChevronRight className="size-4 text-slate-400" />}
        </button>

        <div className={`panel-body p-4 flex flex-col gap-4 border-t border-white/10 ${sections.metaNegative ? "" : "panel-body--collapsed"}`}>
          
          {/* Aspect Ratio Selector (Spec #4) */}
          <AspectRatioSelector
            selected={fields.aspectRatio}
            onChange={(val) => onChangeField("aspectRatio", val)}
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
            {/* Photographer reference */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Photographer Ref
              </label>
              <input
                type="text"
                value={fields.photographerStyle}
                onChange={(e) => onChangeField("photographerStyle", e.target.value)}
                placeholder="E.g., Steve McCurry, Ansel Adams"
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>

            {/* Aesthetic reference */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Visual Aesthetic
              </label>
              <input
                type="text"
                value={fields.visualAesthetic}
                onChange={(e) => onChangeField("visualAesthetic", e.target.value)}
                placeholder="E.g., cyberpunk, vaporwave"
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>

            {/* Texture */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Surface Texture
              </label>
              <input
                type="text"
                value={fields.texture}
                onChange={(e) => onChangeField("texture", e.target.value)}
                placeholder="E.g., heavy film grain, clean matte"
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>

            {/* Color Grade */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Color Grade
              </label>
              <input
                type="text"
                value={fields.colorGrade}
                onChange={(e) => onChangeField("colorGrade", e.target.value)}
                placeholder="E.g., warm golden undertones, high contrast"
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>
          </div>

          {/* Negative Prompt */}
          <div className="flex flex-col gap-1.5 mt-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Negative Prompt (Directives to avoid)
            </label>
            <textarea
              value={fields.negativePrompt}
              onChange={(e) => onChangeField("negativePrompt", e.target.value)}
              placeholder="E.g., ugly, deformed, blurry, low resolution, watermark, bad lighting"
              rows={2}
              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 resize-none font-sans"
            />
          </div>
        </div>
      </div>

      {/* ────────────────── ASSEMBLED READ-ONLY PROMPT PREVIEW ────────────────── */}
      <div className="border border-white/10 rounded-xl p-4 bg-white/5 backdrop-blur-sm relative overflow-hidden flex flex-col gap-2">
        <div className="absolute top-0 right-0 p-2 opacity-15">
          <Eye className="size-16 text-cyan-400" />
        </div>
        
        <div className="flex justify-between items-center border-b border-white/10 pb-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-cyan-400" />
            Assembled Prompt (Read-Only Live Output)
          </span>
          <button
            type="button"
            onClick={onReset}
            className="text-[10px] text-slate-400 hover:text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors active:scale-95"
          >
            <RefreshCw className="size-3" />
            Reset Layout
          </button>
        </div>

        <div className="min-h-[48px] text-sm leading-relaxed p-1">
          {assembledPrompt ? (
            <p className="text-slate-200 font-medium select-all">{assembledPrompt}</p>
          ) : (
            <p className="text-slate-500 italic">
              Prompt will build automatically once a Subject / Action is populated.
            </p>
          )}
        </div>
      </div>

      {/* Option Picker Modal Overlay */}
      {isLightingModalOpen && (
        <OptionPickerModal
          title="Select Lighting Preset"
          options={lightingOptions}
          selectedId={fields.lighting}
          onSelect={(id) => onChangeField("lighting", id)}
          onClose={() => setIsLightingModalOpen(false)}
        />
      )}
    </div>
  );
}
