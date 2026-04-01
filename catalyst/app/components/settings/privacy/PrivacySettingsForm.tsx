"use client";

import { useState } from "react";
import SettingsFormRow from "../SettingsFormRow";
import { supabaseBrowser } from "../../../lib/supabase-browser";
import { User } from "@supabase/supabase-js";
import { Loader2, ShieldCheck, Eye, EyeOff } from "lucide-react";

export default function PrivacySettingsForm({ user, preferences }: { user: User; preferences: any }) {
  const [prefs, setPrefs] = useState({
    usageAnalytics: preferences?.usageAnalytics ?? true,
    defaultPromptVisibility: preferences?.defaultPromptVisibility || "private",
    shareAnonymousMetadata: preferences?.shareAnonymousMetadata ?? false,
    ...preferences
  });

  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setSuccess(false);
    try {
      const { error } = await supabaseBrowser
        .from("profiles")
        .update({ preferences: prefs })
        .eq("id", user.id);

      if (error) throw error;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const updatePref = (key: string, value: any) => {
    setPrefs((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl">
      <div className="bg-white/5 rounded-2xl border border-white/10 px-6">
        
        {/* Default Prompt Visibility */}
        <SettingsFormRow
          label="Default Prompt Visibility"
          description="Sets the initial visibility state for new prompts created in the Studio."
        >
          <div className="flex bg-black/40 rounded-xl p-1 border border-white/10">
            {[
              { id: "private", label: "Private", icon: EyeOff },
              { id: "public", label: "Public", icon: Eye }
            ].map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => updatePref("defaultPromptVisibility", option.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    prefs.defaultPromptVisibility === option.id
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-neon"
                      : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <Icon className="size-4" />
                  {option.label}
                </button>
              );
            })}
          </div>
        </SettingsFormRow>

        {/* Usage Analytics */}
        <SettingsFormRow
          label="Usage Analytics"
          description="Allow Catalyst to collect anonymous telemetry to improve model calibration and UI speed."
        >
          <button
            onClick={() => updatePref("usageAnalytics", !prefs.usageAnalytics)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              prefs.usageAnalytics ? "bg-cyan-500" : "bg-slate-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                prefs.usageAnalytics ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </SettingsFormRow>

        {/* Anonymous Sharing */}
        <SettingsFormRow
          label="Share Metadata"
          description="Share anonymous prompt metadata with the community for better global defaults."
        >
          <button
            onClick={() => updatePref("shareAnonymousMetadata", !prefs.shareAnonymousMetadata)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              prefs.shareAnonymousMetadata ? "bg-cyan-500" : "bg-slate-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                prefs.shareAnonymousMetadata ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </SettingsFormRow>

      </div>

      <div className="flex items-center justify-end gap-4 mt-2">
        {success && (
          <span className="text-green-400 text-sm flex items-center gap-2">
            <ShieldCheck className="size-4" /> Privacy updated
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving && <Loader2 className="size-4 animate-spin" />}
          Update Privacy
        </button>
      </div>
    </div>
  );
}
