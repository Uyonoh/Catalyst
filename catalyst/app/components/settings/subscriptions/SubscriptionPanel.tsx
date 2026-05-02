"use client";

import { useState } from "react";
import SettingsFormRow from "../SettingsFormRow";
import { Loader2, Zap, Check, ExternalLink } from "lucide-react";

interface SubscriptionPanelProps {
  plan: string;
  promptsCount: number;
  analysesCount: number;
}

export default function SubscriptionPanel({
  plan,
  promptsCount,
  analysesCount,
}: SubscriptionPanelProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const isPro = plan === "pro" || plan === "enterprise";

  const handleManageBilling = async () => {
    setIsRedirecting(true);
    try {
      const resp = await fetch("/api/settings/billing-portal");
      const { url } = await resp.json();
      if (url && url !== "#") {
        window.open(url, "_blank");
      } else {
        // Stub implementation fallback
        alert("Billing portal integration coming soon!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRedirecting(false);
    }
  };

  const getTierBadge = () => {
    if (plan === "enterprise")
      return (
        <div className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase">
          Enterprise
        </div>
      );
    if (plan === "pro")
      return (
        <div className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase">
          Pro Tier
        </div>
      );
    return (
      <div className="bg-slate-500/10 text-slate-400 border border-slate-500/20 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase">
        Free Tier
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-3xl">
      {/* Current Plan Card */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-black/20 p-5 sm:p-8 pt-8 sm:pt-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              Catalyst Studio {getTierBadge()}
            </h3>
            <p className="text-slate-400 text-sm">
              {isPro
                ? "You have full access to advanced features, premium models, and higher token limits."
                : "Upgrade to unlock premium AI models, advanced live analysis, and unlimited prompts."}
            </p>
          </div>

          <button
            onClick={handleManageBilling}
            disabled={isRedirecting}
            className="shrink-0 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50 min-w-[160px]"
          >
            {isRedirecting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ExternalLink className="size-4" />
            )}
            Manage Billing
          </button>
        </div>

        {/* Feature comparison mini-table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/5">
          <div className="flex items-center gap-3">
            <Check
              className={`size-5 ${isPro ? "text-cyan-400" : "text-green-400"}`}
            />
            <span className="text-sm font-medium text-slate-300">
              Standard Models (GPT-3.5, Gemini Flash)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Check
              className={`size-5 ${isPro ? "text-cyan-400" : "text-green-400"}`}
            />
            <span className="text-sm font-medium text-slate-300">
              Basic Workspace Folders
            </span>
          </div>
          <div className="flex items-center gap-3">
            {isPro ? (
              <Check className="size-5 text-cyan-400" />
            ) : (
              <div className="size-5 rounded-full border border-slate-600/50" />
            )}
            <span
              className={`text-sm font-medium ${isPro ? "text-slate-300" : "text-slate-500"}`}
            >
              Premium Models (GPT-4o, Claude Opus)
            </span>
          </div>
          <div className="flex items-center gap-3">
            {isPro ? (
              <Check className="size-5 text-cyan-400" />
            ) : (
              <div className="size-5 rounded-full border border-slate-600/50" />
            )}
            <span
              className={`text-sm font-medium ${isPro ? "text-slate-300" : "text-slate-500"}`}
            >
              Deep Intent & NLP Analysis
            </span>
          </div>
        </div>
      </div>

      {/* Usage Stats Panel */}
      <section id="usage-stats">
        <h4 className="text-xl font-bold text-white mt-10">Current Usage</h4>

        <div className="bg-white/5 rounded-2xl border border-white/10 px-6 overflow-hidden mt-5">
          <SettingsFormRow
            label="Optimized Prompts"
            description="Total number of prompts you've created and refined."
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-end gap-2 text-white font-mono text-xl">
                {promptsCount}{" "}
                <span className="text-slate-500 text-sm font-sans">
                  {!isPro ? "/ 50" : "/ ∞"}
                </span>
              </div>
              {!isPro && (
                <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-400 h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min((promptsCount / 50) * 100, 100)}%`,
                    }}
                  />
                </div>
              )}
            </div>
          </SettingsFormRow>

          <SettingsFormRow
            label="Live Analyses Run"
            description="Number of times Catalyst has deconstructed your prompts."
          >
            <div className="flex items-center justify-end gap-2 text-white font-mono text-xl">
              {analysesCount} <Zap className="size-5 text-yellow-500" />
            </div>
          </SettingsFormRow>
        </div>
      </section>
    </div>
  );
}
