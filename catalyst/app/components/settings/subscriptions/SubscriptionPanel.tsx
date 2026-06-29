"use client";

import React from "react";
import { useState } from "react";
import SettingsFormRow from "../SettingsFormRow";
import {
  Loader2,
  Zap,
  Check,
  ExternalLink,
  InfinityIcon,
  FolderOpen,
  Heart,
  BarChart3,
  Bot,
  Sparkles,
} from "lucide-react";
import { useTokens } from "../../../hooks/useTokens";
import { useRouter } from "next/navigation";

interface SubscriptionPanelProps {
  plan: string;
  promptsCount: number;
  analysesCount: number;
  workspacesCount?: number;
  favoritesCount?: number;
  recentLogs?: any[];
  weeklyChartData?: any[];
}

const MODEL_THEME: Record<
  string,
  { label: string; colorClass: string; bgClass: string }
> = {
  gpt: {
    label: "GPT-4o",
    colorClass: "text-emerald-400",
    bgClass: "bg-emerald-500/10 border-emerald-500/20",
  },
  claude: {
    label: "Claude 4",
    colorClass: "text-violet-400",
    bgClass: "bg-violet-500/10 border-violet-500/20",
  },
  gemini: {
    label: "Gemini 3",
    colorClass: "text-amber-400",
    bgClass: "bg-amber-500/10 border-amber-500/20",
  },
  llama: {
    label: "Llama 3",
    colorClass: "text-orange-400",
    bgClass: "bg-orange-500/10 border-orange-500/20",
  },
  grok: {
    label: "Grok-1",
    colorClass: "text-cyan-400",
    bgClass: "bg-cyan-500/10 border-cyan-500/20",
  },
  dalle: {
    label: "DALL-E 3",
    colorClass: "text-pink-400",
    bgClass: "bg-pink-500/10 border-pink-500/20",
  },
  stablediffusion: {
    label: "SDXL",
    colorClass: "text-blue-400",
    bgClass: "bg-blue-500/10 border-blue-500/20",
  },
  midjourney: {
    label: "MJ v6",
    colorClass: "text-cyan-400",
    bgClass: "bg-cyan-500/10 border-cyan-500/20",
  },
  veo: {
    label: "Veo Video",
    colorClass: "text-rose-400",
    bgClass: "bg-rose-500/10 border-rose-500/20",
  },
};

export default function SubscriptionPanel({
  plan,
  promptsCount,
  analysesCount,
  workspacesCount = 0,
  favoritesCount = 0,
  recentLogs = [],
  weeklyChartData = [],
}: SubscriptionPanelProps) {
  const { weeklyLimit, used, percentage, isExhausted } = useTokens();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const isSubscribed = plan !== "free"; 
  const router = useRouter();

  const handleManageBilling = async () => {
    if (!isSubscribed) {
      router.push("/settings/subscriptions/pricing");
      return;
    }
    setIsRedirecting(true);
    try {
      const resp = await fetch("/api/settings/billing-portal");
      const { url } = await resp.json();
      if (url && url !== "#") {
        if (url.startsWith("/")) {
          router.push(url);
        } else {
          window.open(url, "_blank");
        }
      } else {
        alert("Billing portal integration coming soon!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRedirecting(false);
    }
  };

  const getTierBadge = () => {
    const badges: Record<string, React.ReactElement> = {
      free: (
        <div className="bg-slate-500/10 text-slate-400 border border-slate-500/20 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase">
          Free
        </div>
      ),
      basic: (
        <div className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase">
          Basic
        </div>
      ),
      plus: (
        <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase">
          Plus
        </div>
      ),
      pro: (
        <div className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase">
          Pro
        </div>
      ),
      ultra: (
        <div className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-gradient-to-r from-purple-500/10 to-indigo-500/10">
          Ultra
        </div>
      ),
    };
    return badges[plan.toLowerCase()] ?? (
      <div className="bg-slate-500/10 text-slate-400 border border-slate-500/20 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase">
        {plan}
      </div>
    );
  };

  const maxWeeklyCost =
    weeklyChartData.length > 0
      ? Math.max(...weeklyChartData.map((d: any) => d.cost), 10)
      : 10;

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
              {isSubscribed
                ? "You have full access to advanced features, premium models, and higher token limits."
                : "Upgrade to unlock premium AI models, advanced live analysis, and unlimited prompts."}
            </p>
          </div>

          <button
            onClick={handleManageBilling}
            disabled={isRedirecting}
            className="shrink-0 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50 min-w-[160px] cursor-pointer"
          >
            {isRedirecting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ExternalLink className="size-4" />
            )}
            {isSubscribed ? "Manage Billing" : "Upgrade Plan"}
          </button>
        </div>

        {/* Feature comparison mini-table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/5">
          <div className="flex items-center gap-3">
            <Check
              className={`size-5 ${isSubscribed ? "text-cyan-400" : "text-green-400"}`}
            />
            <span className="text-sm font-medium text-slate-300">
              Standard Models (GPT-3.5, Gemini Flash)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Check
              className={`size-5 ${isSubscribed ? "text-cyan-400" : "text-green-400"}`}
            />
            <span className="text-sm font-medium text-slate-300">
              Basic Workspace Folders
            </span>
          </div>
          <div className="flex items-center gap-3">
            {isSubscribed ? (
              <Check className="size-5 text-cyan-400" />
            ) : (
              <div className="size-5 rounded-full border border-slate-600/50" />
            )}
            <span
              className={`text-sm font-medium ${isSubscribed ? "text-slate-300" : "text-slate-500"}`}
            >
              Premium Models (GPT-4o, Claude Opus)
            </span>
          </div>
          <div className="flex items-center gap-3">
            {isSubscribed ? (
              <Check className="size-5 text-cyan-400" />
            ) : (
              <div className="size-5 rounded-full border border-slate-600/50" />
            )}
            <span
              className={`text-sm font-medium ${isSubscribed ? "text-slate-300" : "text-slate-500"}`}
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
                  {!isSubscribed ? "/ 50" : "/ ∞"}
                </span>
              </div>
              {!isSubscribed && (
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
            label="Workspaces Created"
            description="Hubs created to organize and categorize your templates."
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-end gap-2 text-white font-mono text-xl">
                {workspacesCount}{" "}
                <span className="text-slate-500 text-sm font-sans">
                  {!isSubscribed ? "/ 5" : "/ ∞"}
                </span>
              </div>
              {!isSubscribed && (
                <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-400 h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min((workspacesCount / 5) * 100, 100)}%`,
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

          <SettingsFormRow
            label="Starred Favorites"
            description="Curated high-performing prompts tagged for quick recovery."
          >
            <div className="flex items-center justify-end gap-2 text-white font-mono text-xl">
              {favoritesCount}{" "}
              <Heart className="size-5 text-rose-500 fill-rose-500/20" />
            </div>
          </SettingsFormRow>

          <SettingsFormRow
            label="Weekly Token Usage"
            description="Rolling-window tokens consumed by AI generations (resets 7 days after your first request in each window)."
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-end gap-2 text-white font-mono text-xl">
                {plan === "ultra" ? (
                  <span className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Unlimited{" "}
                    <InfinityIcon className="w-5 h-5 text-purple-400" />
                  </span>
                ) : (
                  <>
                    {used.toLocaleString()}{" "}
                    <span className="text-slate-500 text-sm font-sans">
                      / {weeklyLimit.toLocaleString()} tokens
                    </span>
                  </>
                )}
              </div>
              {plan !== "ultra" && (
                <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                  <div
                    className={`${
                      isExhausted
                        ? "bg-red-500"
                        : percentage >= 80
                          ? "bg-red-500"
                          : percentage >= 50
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                    } h-full rounded-full transition-all`}
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                    }}
                  />
                </div>
              )}
            </div>
          </SettingsFormRow>
        </div>

        {/* Weekly Consumption Graph */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6 overflow-hidden mt-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="size-5 text-cyan-400" />
            <h5 className="text-white text-sm font-bold uppercase tracking-wider">
              Weekly Quota Consumption
            </h5>
          </div>
          {weeklyChartData.length === 0 ? (
            <div className="h-28 flex items-center justify-center border border-dashed border-white/5 rounded-xl text-xs text-slate-500">
              No token activity recorded this week.
            </div>
          ) : (
            <div className="h-35 flex items-end justify-between px-2 pt-4 bg-white/[0.02] border border-white/5 rounded-xl">
              {weeklyChartData.map((day, idx) => {
                const barHeightPercent = Math.max(
                  1,
                  Math.round((day.cost / maxWeeklyCost) * 100),
                );
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center flex-1 group relative"
                  >
                    <div className="absolute bottom-full mb-2 bg-slate-950 border border-white/10 px-2 py-1 rounded text-[9px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap shadow-lg">
                      {day.cost} tokens
                    </div>
                    <div
                      className="w-4/12 min-w-[8px] rounded-t bg-gradient-to-t from-cyan-600/40 to-cyan-400/90 group-hover:to-cyan-300 transition-all duration-500 ease-out"
                      style={{ height: `${barHeightPercent}px` }}
                    />
                    <span className="text-[9px] font-bold text-slate-500 group-hover:text-slate-300 transition-colors mt-2 pb-1.5 uppercase font-mono">
                      {day.dateStr}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Ledgers / Recent Token logs list */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6 overflow-hidden mt-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-cyan-400" />
            <h5 className="text-white text-sm font-bold uppercase tracking-wider">
              Usage Ledger (Last 10 Actions)
            </h5>
          </div>

          {recentLogs.length === 0 ? (
            <div className="p-8 border border-dashed border-white/5 rounded-xl text-center text-xs text-slate-500">
              No recent logs found. Start optimization in Prompt Studio to track
              usages.
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 max-h-[280px] overflow-y-auto pr-1 dropdown-scroll">
              {recentLogs.map((log: any) => {
                const theme = MODEL_THEME[log.model_slug] || {
                  label: log.model_slug.toUpperCase(),
                  colorClass: "text-slate-400",
                  bgClass: "bg-slate-500/10 border-slate-500/20",
                };
                const date =
                  new Date(log.created_at).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                  }) +
                  " " +
                  new Date(log.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                return (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5 hover:bg-black/30 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg border ${theme.bgClass} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}
                      >
                        <Bot className={`size-4 ${theme.colorClass}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white leading-none">
                            {theme.label}
                          </span>
                          <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-white/5 text-slate-400 rounded leading-none">
                            {log.mode}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium mt-1 block">
                          {date}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-sm font-bold font-mono ${theme.colorClass}`}
                    >
                      -{log.cost}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
