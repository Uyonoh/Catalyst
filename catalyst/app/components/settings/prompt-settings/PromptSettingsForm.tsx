"use client";

import { useState } from "react";
import SettingsFormRow from "../SettingsFormRow";
import { supabaseBrowser } from "../../../lib/supabase-browser";
import { User } from "@supabase/supabase-js";
import { Loader2, Check, Aperture, Target, Type, Workflow, ShieldCheck } from "lucide-react";

const ICON_MAP: Record<string, any> = {
  creativity: Aperture,
  precision: Target,
  length: Type,
  strategy: Workflow,
  failureHandling: ShieldCheck,
};

export default function PromptSettingsForm({ user, preferences }: { user: User; preferences: any }) {
  const [controls, setControls] = useState({
    creativity: preferences?.promptControls?.creativity ?? 0.5,
    precision: preferences?.promptControls?.precision ?? 0.75,
    length: preferences?.promptControls?.length ?? "short",
    strategy: preferences?.promptControls?.strategy ?? "default",
    failureHandling: preferences?.promptControls?.failureHandling ?? true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const updatedPreferences = {
        ...preferences,
        promptControls: controls,
      };

      const { error } = await supabaseBrowser
        .from("profiles")
        .update({ preferences: updatedPreferences })
        .eq("id", user.id);

      if (error) throw error;
      setMessage({ type: "success", text: "Studio defaults saved successfully." });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to save defaults." });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const updateControl = (key: string, value: any) => {
    setControls((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl">
      <div className="bg-white/5 rounded-2xl border border-white/10 px-6 py-2">
        
        {/* Creativity */}
        <SettingsFormRow
          label="Default Creativity"
          description="Baseline freedom for the engine to elaborate on details."
        >
          <div className="flex items-center gap-4 w-full max-w-xs">
            <input
              type="range"
              min="0"
              max="100"
              value={controls.creativity * 100}
              onChange={(e) => updateControl("creativity", parseInt(e.target.value) / 100)}
              className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <span className="text-xs font-mono text-purple-400 w-8">{(controls.creativity * 100).toFixed(0)}%</span>
          </div>
        </SettingsFormRow>

        {/* Precision */}
        <SettingsFormRow
          label="Default Precision"
          description="Baseline adherence to your specific raw intent."
        >
          <div className="flex items-center gap-4 w-full max-w-xs">
            <input
              type="range"
              min="0"
              max="100"
              value={controls.precision * 100}
              onChange={(e) => updateControl("precision", parseInt(e.target.value) / 100)}
              className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <span className="text-xs font-mono text-cyan-400 w-8">{(controls.precision * 100).toFixed(0)}%</span>
          </div>
        </SettingsFormRow>

        {/* Output Length */}
        <SettingsFormRow
          label="Default Output Length"
          description="The preferred verbosity of optimized prompts."
        >
          <div className="flex bg-black/40 rounded-xl p-1 border border-white/10 w-full max-w-xs">
            {["short", "medium", "long"].map((len) => (
              <button
                key={len}
                onClick={() => updateControl("length", len)}
                className={`flex-1 capitalize py-1.5 px-3 rounded-lg text-[11px] font-bold transition-all uppercase tracking-wider ${
                  controls.length === len
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-neon"
                    : "text-slate-500 hover:text-slate-300 border border-transparent"
                }`}
              >
                {len}
              </button>
            ))}
          </div>
        </SettingsFormRow>

        {/* Reasoning Strategy */}
        <SettingsFormRow
          label="Default Reasoning Strategy"
          description="The preferred logical processing mode."
        >
          <select
            value={controls.strategy}
            onChange={(e) => updateControl("strategy", e.target.value)}
            className="w-full max-w-xs bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50 appearance-none cursor-pointer"
          >
            <option value="default">Standard (Direct)</option>
            <option value="chain_of_thought">Thought (Step-by-step)</option>
          </select>
        </SettingsFormRow>

        {/* Failure Handling */}
        <SettingsFormRow
          label="Default Robustness"
          description="Automatically resolve prompt ambiguity with assumptions."
        >
          <button
            onClick={() => updateControl("failureHandling", !controls.failureHandling)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              controls.failureHandling ? "bg-blue-500" : "bg-slate-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                controls.failureHandling ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </SettingsFormRow>

      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="flex-1">
          {message && (
            <p className={`text-sm flex items-center gap-2 ${message.type === "error" ? "text-red-400" : "text-green-400"}`}>
              {message.type === "success" && <Check className="size-4" />}
              {message.text}
            </p>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="shrink-0 bg-primary hover:bg-primary/90 text-white px-8 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2 border border-white/10 hover:border-white/20 shadow-lg"
        >
          {isSaving && <Loader2 className="size-4 animate-spin" />}
          Save Studio Defaults
        </button>
      </div>
    </div>
  );
}
