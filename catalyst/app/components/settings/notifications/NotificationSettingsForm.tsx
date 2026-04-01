"use client";

import { useState } from "react";
import SettingsFormRow from "../SettingsFormRow";
import { supabaseBrowser } from "../../../lib/supabase-browser";
import { User } from "@supabase/supabase-js";
import { Loader2, Check, Bell } from "lucide-react";

export default function NotificationSettingsForm({ user, preferences }: { user: User; preferences: any }) {
  const [prefs, setPrefs] = useState({
    notifyPromptCompletion: preferences?.notifyPromptCompletion ?? true,
    notifySecurityAlerts: preferences?.notifySecurityAlerts ?? true,
    notifyProductUpdates: preferences?.notifyProductUpdates ?? false,
    notifyMarketing: preferences?.notifyMarketing ?? false,
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
        
        {/* Prompt Completion */}
        <SettingsFormRow
          label="Prompt Completion"
          description="Receive an email when a long-running batch prompt or deep analysis finishes."
        >
          <button
            onClick={() => updatePref("notifyPromptCompletion", !prefs.notifyPromptCompletion)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              prefs.notifyPromptCompletion ? "bg-cyan-500" : "bg-slate-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                prefs.notifyPromptCompletion ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </SettingsFormRow>

        {/* Security Alerts */}
        <SettingsFormRow
          label="Security & Account"
          description="Crucial alerts regarding login from new devices, password changes, and billing."
        >
          <button
            onClick={() => updatePref("notifySecurityAlerts", !prefs.notifySecurityAlerts)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              prefs.notifySecurityAlerts ? "bg-cyan-500" : "bg-slate-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                prefs.notifySecurityAlerts ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </SettingsFormRow>

        {/* Product Updates */}
        <SettingsFormRow
          label="Product Updates"
          description="Monthly newsletter about new Catalyst features, models, and studio improvements."
        >
          <button
            onClick={() => updatePref("notifyProductUpdates", !prefs.notifyProductUpdates)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              prefs.notifyProductUpdates ? "bg-cyan-500" : "bg-slate-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                prefs.notifyProductUpdates ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </SettingsFormRow>

        {/* Marketing */}
        <SettingsFormRow
          label="Marketing & Offers"
          description="Occasional emails about pro-tier discounts and partner promotions."
        >
          <button
            onClick={() => updatePref("notifyMarketing", !prefs.notifyMarketing)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              prefs.notifyMarketing ? "bg-cyan-500" : "bg-slate-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                prefs.notifyMarketing ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </SettingsFormRow>

      </div>

      <div className="flex items-center justify-end gap-4 mt-2">
        {success && (
          <span className="text-green-400 text-sm flex items-center gap-2">
            <Check className="size-4" /> Preferences updated
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving && <Loader2 className="size-4 animate-spin" />}
          Update Notifications
        </button>
      </div>
    </div>
  );
}
