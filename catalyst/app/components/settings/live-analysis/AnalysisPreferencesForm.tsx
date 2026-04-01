"use client";

import { useState } from "react";
import SettingsFormRow from "../SettingsFormRow";
import { supabaseBrowser } from "../../../lib/supabase-browser";
import { User } from "@supabase/supabase-js";
import { Loader2, Check } from "lucide-react";

export default function AnalysisPreferencesForm({ user, preferences }: { user: User; preferences: any }) {
  const [prefs, setPrefs] = useState({
    analysisDepth: preferences?.analysisDepth || "standard",
    autoAnalyze: preferences?.autoAnalyze ?? true,
    defaultOutputFormat: preferences?.defaultOutputFormat || "MARKDOWN",
    defaultTone: preferences?.defaultTone || "PROFESSIONAL",
    ...preferences
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const { error } = await supabaseBrowser
        .from("profiles")
        .update({ preferences: prefs })
        .eq("id", user.id);

      if (error) throw error;
      setMessage({ type: "success", text: "Preferences saved successfully. They will take effect immediately in the Studio." });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to save preferences." });
    } finally {
      setIsSaving(false);
      
      // Auto-clear success message after 3 seconds
      if (message?.type !== "error") {
        setTimeout(() => setMessage(null), 3000);
      }
    }
  };

  const updatePref = (key: string, value: any) => {
    setPrefs((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl">
      <div className="bg-white/5 rounded-2xl border border-white/10 px-6">
        
        {/* Analysis Depth */}
        <SettingsFormRow
          label="Analysis Depth"
          description="Controls how comprehensively the engine deconstructs your prompts."
        >
          <div className="flex bg-black/40 rounded-xl p-1 border border-white/10">
            {["surface", "standard", "deep"].map((depth) => (
              <button
                key={depth}
                onClick={() => updatePref("analysisDepth", depth)}
                className={`flex-1 capitalize py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  prefs.analysisDepth === depth
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-neon"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                {depth}
              </button>
            ))}
          </div>
        </SettingsFormRow>

        {/* Auto Analyze */}
        <SettingsFormRow
          label="Auto-Analyze"
          description="Automatically trigger analysis when you stop typing in the Studio."
        >
          <button
            onClick={() => updatePref("autoAnalyze", !prefs.autoAnalyze)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              prefs.autoAnalyze ? "bg-cyan-500" : "bg-slate-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                prefs.autoAnalyze ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </SettingsFormRow>

        {/* Output Format */}
        <SettingsFormRow
          label="Default Output Format"
          description="The preferred structure for the engine's optimized prompts."
        >
          <select
            value={prefs.defaultOutputFormat}
            onChange={(e) => updatePref("defaultOutputFormat", e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 appearance-none cursor-pointer"
          >
            <option value="MARKDOWN">Markdown</option>
            <option value="JSON">Strict JSON</option>
            <option value="YAML">YAML Configuration</option>
            <option value="PLAIN_TEXT">Plain Text</option>
          </select>
        </SettingsFormRow>

        {/* Tone */}
        <SettingsFormRow
          label="Default Tone Constraint"
          description="The overarching voice the compiler should aim for."
        >
          <select
            value={prefs.defaultTone}
            onChange={(e) => updatePref("defaultTone", e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 appearance-none cursor-pointer"
          >
            <option value="PROFESSIONAL">Professional Outline</option>
            <option value="CONCISE">Concise / Direct</option>
            <option value="CREATIVE">Creative Storytelling</option>
            <option value="ACADEMIC">Academic / Rigorous</option>
            <option value="ELI5">Explain Like I'm 5</option>
          </select>
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
          className="shrink-0 bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving && <Loader2 className="size-4 animate-spin" />}
          Save Preferences
        </button>
      </div>
    </div>
  );
}
