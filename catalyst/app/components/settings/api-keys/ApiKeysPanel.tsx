"use client";

import { useEffect, useState } from "react";
import SettingsFormRow from "../SettingsFormRow";
import { Plus, Trash, Check, AlertCircle, Loader2 } from "lucide-react";

const PROVIDERS = [
  { id: "openai", name: "OpenAI", prefix: "sk-", helpLink: "https://platform.openai.com/api-keys" },
  { id: "anthropic", name: "Anthropic", prefix: "sk-ant-", helpLink: "https://console.anthropic.com/settings/keys" },
  { id: "google", name: "Google AI (Gemini)", prefix: "AIza", helpLink: "https://aistudio.google.com/app/apikey" }
];

export default function ApiKeysPanel() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingFor, setSavingFor] = useState<string | null>(null);
  const [newKeyValues, setNewKeyValues] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const resp = await fetch("/api/settings/api-keys");
      const data = await resp.json();
      setKeys(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (provider: string) => {
    setSavingFor(provider);
    setMessage(null);
    try {
      const resp = await fetch("/api/settings/api-keys", {
        method: "POST",
        body: JSON.stringify({ provider, key: newKeyValues[provider] }),
      });
      if (!resp.ok) throw new Error("Failed to save key");
      
      setNewKeyValues(prev => ({ ...prev, [provider]: "" }));
      setMessage({ type: "success", text: `${provider.toUpperCase()} key saved!` });
      await fetchKeys();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSavingFor(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch("/api/settings/api-keys/" + id, { method: "DELETE" });
      await fetchKeys();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-cyan-400" /></div>;

  return (
    <div className="flex flex-col gap-8 w-full max-w-3xl">
      {message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 animate-fadeIn ${
          message.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
        }`}>
          {message.type === "success" ? <Check className="size-5" /> : <AlertCircle className="size-5" />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {PROVIDERS.map((provider) => {
          const existing = keys.find(k => k.provider === provider.id);
          const val = newKeyValues[provider.id] || "";

          return (
            <div key={provider.id} className="bg-white/5 rounded-2xl border border-white/10 px-6 py-2 overflow-hidden">
              <SettingsFormRow
                label={provider.name}
                description={
                  <span className="block truncate sm:whitespace-normal">
                    Get your key at <a href={provider.helpLink} target="_blank" className="text-cyan-500 hover:underline break-all">{provider.helpLink.replace("https://", "")}</a>
                  </span>
                }
              >
                <div className="flex flex-col gap-3">
                  {existing ? (
                    <div className="flex items-center justify-between bg-black/20 rounded-xl px-4 py-2 border border-white/5">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500 uppercase font-black">Connected</span>
                        <code className="text-sm text-white">{existing.key_preview}</code>
                      </div>
                      <button 
                        onClick={() => handleDelete(existing.id)}
                        className="text-slate-500 hover:text-red-400 transition-colors p-2"
                      >
                        <Trash className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-blue-500/5 text-blue-300 font-medium px-3 py-1.5 rounded-lg text-xs w-fit">
                      <Check className="size-3" /> System Default (Shared Key)
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="password"
                      placeholder={`Paste new ${provider.name} key...`}
                      value={val}
                      onChange={(e) => setNewKeyValues(prev => ({ ...prev, [provider.id]: e.target.value }))}
                      className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                    <button
                      onClick={() => handleSave(provider.id)}
                      disabled={!val || savingFor === provider.id}
                      className="shrink-0 bg-primary hover:bg-primary/90 text-white p-2 rounded-xl disabled:opacity-30 transition-all font-bold"
                    >
                      {savingFor === provider.id ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-5" />}
                    </button>
                  </div>
                </div>
              </SettingsFormRow>
            </div>
          );
        })}
      </div>
    </div>
  );
}
