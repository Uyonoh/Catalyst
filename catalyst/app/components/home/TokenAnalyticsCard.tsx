"use client";

import React, { useState } from "react";
import {
  InfinityIcon,
  HelpCircle,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Bot,
  Zap,
} from "lucide-react";
import { FREE_WEEKLY_LIMIT, BASIC_WEEKLY_LIMIT, PLUS_WEEKLY_LIMIT, PRO_WEEKLY_LIMIT, tierLimits } from "../../lib/tokens";

interface TokenLog {
  id: string;
  model_slug: string;
  mode: string;
  cost: number;
  created_at: string;
}

interface TokenAnalyticsCardProps {
  plan: "free" | "basic" | "plus" | "pro" | "ultra";
  dailyTokensUsed: number;
  recentLogs: TokenLog[];
  weeklyChartData: { dateStr: string; cost: number }[];
}

// Map slugs to clean names & accent colors
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

export default function TokenAnalyticsCard({
  plan = "free",
  dailyTokensUsed = 0,
  recentLogs = [],
  weeklyChartData = [],
}: TokenAnalyticsCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const isUltra = plan === "ultra";
  const limit = tierLimits[plan];
  const remaining = isUltra
    ? Infinity
    : Math.max(0, limit - dailyTokensUsed);
  const percentage = isUltra
    ? 0
    : Math.min(100, Math.round((dailyTokensUsed / limit) * 100));

  // Determine theme colors based on quota exhaustion
  let strokeColor = "stroke-cyan-500";
  let glowColor = "rgba(6, 182, 212, 0.5)"; // cyan glow
  let textClass = "text-cyan-400";
  let limitLabel = isUltra
    ? "Unlimited"
    : `${dailyTokensUsed} / ${limit} Weekly`;

  if (!isUltra) {
    if (percentage >= 90) {
      strokeColor = "stroke-rose-500";
      glowColor = "rgba(244, 63, 94, 0.5)";
      textClass = "text-rose-400";
    } else if (percentage >= 60) {
      strokeColor = "stroke-amber-500";
      glowColor = "rgba(245, 158, 11, 0.5)";
      textClass = "text-amber-400";
    } else {
      strokeColor = "stroke-emerald-500";
      glowColor = "rgba(16, 185, 129, 0.5)";
      textClass = "text-emerald-400";
    }
  }

  // SVG parameters for radial progress circle
  const size = 130;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Make the stroke dashoffset represent remaining tokens (if 100% used, offset = circumference)
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Find max cost in weekly logs to scale the chart bars
  const maxWeeklyCost = Math.max(...weeklyChartData.map((d) => d.cost), 10);

  // Time remaining to UTC midnight
  const getUTCMidnightCountdown = () => {
    const now = new Date();
    const utcNow = new Date(now.toUTCString());
    const utcMidnight = new Date(
      Date.UTC(
        utcNow.getUTCFullYear(),
        utcNow.getUTCMonth(),
        utcNow.getUTCDate() + 1,
        0,
        0,
        0,
        0,
      ),
    );
    const diffMs = utcMidnight.getTime() - utcNow.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div
      className="glass-panel rounded-2xl p-6 mb-12 flex flex-col relative z-10 animate-slideDown overflow-hidden border border-white/5 shadow-2xl"
      style={{ animationDelay: "0.15s", animationFillMode: "both" }}
    >
      {/* Background Neon Mesh Glow */}
      <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] rounded-full bg-cyan-500/5 blur-[80px] pointer-events-none z-0"></div>

      {/* Top Header */}
      <div className="flex items-center justify-between mb-6 z-20">
        <div>
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <TrendingUp className="size-5 text-cyan-400" />
            Quota Analytics
          </h3>
          <p className="text-slate-400 text-xs mt-0.5">
            Real-time resource utilization & ledger
          </p>
        </div>
        <div className="relative">
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="text-slate-500 hover:text-white transition-colors p-1"
          >
            <HelpCircle className="size-4" />
          </button>
          {showTooltip && (
            <div className="absolute right-0 top-full mt-1.5 w-64 p-3 bg-slate-950/95 border border-white/10 rounded-lg text-[11px] text-slate-300 leading-relaxed shadow-xl backdrop-blur-md z-30 transition-all">
              Optimizing prompts consumes daily tokens based on model
              intelligence and modalities. Free tier grants 50 tokens daily. Pro
              Tier expands quota to 200 tokens. Quota resets at 00:00 UTC.
            </div>
          )}
        </div>
      </div>

      {/* Quota Ring and Progress Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center justify-between mb-8 z-10 pb-6 border-b border-white/5">
        <div className="sm:col-span-5 flex justify-center relative">
          {/* Circular Progress Gauge */}
          <div className="relative size-[130px] flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Background Circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                className="stroke-slate-800"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Dynamic Quota Arc */}
              {!isUltra && (
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  className={`transition-all duration-700 ease-out ${strokeColor}`}
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{
                    filter: `drop-shadow(0 0 6px ${glowColor})`,
                  }}
                />
              )}
            </svg>
            {/* Center Content */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              {isUltra ? (
                <>
                  <InfinityIcon className="size-8 text-purple-400" />
                  <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mt-1">
                    Unlimited
                  </span>
                </>
              ) : (
                <>
                  <span className="text-2xl font-black text-white tracking-tight leading-none">
                    {100 - percentage}%
                  </span>
                  <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-1">
                    Remaining
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="sm:col-span-7 flex flex-col gap-3 justify-center">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              Catalyst Plan
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                plan === "ultra"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : plan === "pro"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    : "bg-slate-500/20 text-slate-300 border border-slate-500/30"
              }`}
            >
              {plan}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              Daily Tokens Spent
            </span>
            <span className={`font-mono text-sm font-bold ${textClass}`}>
              {limitLabel}
            </span>
          </div>

          {!isUltra && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">
                Next Reset Countdown
              </span>
              <span className="text-slate-200 text-xs font-semibold flex items-center gap-1 font-mono">
                <Zap className="size-3 text-yellow-500" />
                {getUTCMidnightCountdown()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 7-Day CSS Bar Chart */}
      <div className="mb-6 z-10">
        <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Sparkles className="size-3.5 text-cyan-400" />
          Weekly Token Trend (Last 7 Days)
        </h4>

        {weeklyChartData.length === 0 ? (
          <div className="h-28 flex items-center justify-center border border-dashed border-white/5 rounded-xl text-xs text-slate-500">
            No token activity recorded this week
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
                  {/* Tooltip on Hover */}
                  <div className="absolute bottom-full mb-2 bg-slate-950 border border-white/10 px-2 py-1 rounded text-[9px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap shadow-lg">
                    {day.cost} tokens
                  </div>
                  {/* Glowing Bar */}
                  <div
                    className="w-4/12 min-w-[8px] rounded-t bg-gradient-to-t from-cyan-600/40 to-cyan-400/90 group-hover:to-cyan-300 transition-all duration-500 ease-out"
                    style={{ height: `${barHeightPercent}px` }}
                  />
                  {/* Weekday Label */}
                  <span className="text-[9px] font-bold text-slate-500 group-hover:text-slate-300 transition-colors mt-2 pb-1.5 uppercase font-mono">
                    {day.dateStr}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Transaction Ledger */}
      <div className="z-10 mt-2">
        <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>Usage Ledger</span>
          <a
            href="/settings/subscriptions#usage-stats"
            className="text-[10px] text-slate-500 hover:text-cyan-400 flex items-center transition-colors"
          >
            Full History <ChevronRight className="size-3" />
          </a>
        </h4>

        {recentLogs.length === 0 ? (
          <div className="p-4 border border-dashed border-white/5 rounded-xl text-center text-xs text-slate-500">
            Prompt generations will log here
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-h-[170px] overflow-y-auto pr-1 dropdown-scroll">
            {recentLogs.map((log) => {
              const theme = MODEL_THEME[log.model_slug] || {
                label: log.model_slug.toUpperCase(),
                colorClass: "text-slate-400",
                bgClass: "bg-slate-500/10 border-slate-500/20",
              };
              const date = new Date(log.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-1.5 rounded-lg border ${theme.bgClass} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}
                    >
                      <Bot className={`size-3.5 ${theme.colorClass}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white leading-none">
                          {theme.label}
                        </span>
                        <span className="text-[8px] font-bold uppercase tracking-wider px-1 py-0.25 bg-white/5 text-slate-400 rounded leading-none">
                          {log.mode}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-500 font-medium font-mono">
                        {date}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold font-mono ${theme.colorClass}`}
                  >
                    -{log.cost}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
