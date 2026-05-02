"use client";

import React from "react";
import { useTokens } from "../hooks/useTokens";
import { InfinityIcon } from "lucide-react";
import Link from "next/link";

export function TokenMeter() {
  const {
    isPro,
    isEnterprise,
    dailyLimit,
    remaining,
    percentage,
    isExhausted,
  } = useTokens();

  if (isEnterprise) {
    return (
      <Link
        href="/settings/subscriptions#usage-stats"
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full border border-indigo-500/20 hover:bg-indigo-500/5 transition-colors cursor-pointer"
      >
        <span className="text-xs font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          ENTERPRISE
        </span>
        <InfinityIcon className="w-3.5 h-3.5 text-purple-400" />
      </Link>
    );
  }

  // Determine color based on percentage
  let meterColor = "bg-emerald-500";
  let textColor = "text-emerald-400";
  let ringColor = "ring-emerald-500/20";

  if (isExhausted) {
    meterColor = "bg-red-500";
    textColor = "text-red-400";
    ringColor = "ring-red-500/20";
  } else if (percentage >= 80) {
    // 20% or less remaining corresponds to 80% used
    meterColor = "bg-red-500";
    textColor = "text-red-400";
    ringColor = "ring-red-500/20";
  } else if (percentage >= 50) {
    // 20-50% remaining corresponds to 50-80% used
    meterColor = "bg-amber-500";
    textColor = "text-amber-400";
    ringColor = "ring-amber-500/20";
  }

  return (
    <Link
      href="/settings/subscriptions#usage-stats"
      className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 group cursor-pointer transition-colors hover:bg-white/10 relative"
      title={
        isExhausted
          ? "Quota reached. Resets tomorrow at midnight UTC."
          : `${remaining} of ${dailyLimit} tokens remaining`
      }
    >
      {/* Text Label */}
      {isPro ? (
        <span className="text-xs font-medium text-slate-300">
          <span className={textColor}>{remaining}</span> / {dailyLimit} tokens
        </span>
      ) : (
        <span className="text-xs font-medium text-slate-300">
          <span className={textColor}>{remaining}</span> / {dailyLimit} tokens
        </span>
      )}

      {/* Progress Arc/Bar */}
      <div
        className={`w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden ring-1 shadow-inner ${ringColor}`}
      >
        <div
          className={`h-full ${meterColor} transition-all duration-500 ease-out`}
          style={{ width: `${Math.max(0, 100 - percentage)}%` }}
        />
      </div>

      {isExhausted && (
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
        </span>
      )}
    </Link>
  );
}

export function TokensMobile() {
  const {
    isPro,
    isEnterprise,
    dailyLimit,
    remaining,
    percentage,
    isExhausted,
  } = useTokens();

  if (isEnterprise) {
    return (
      <Link
        href="/settings/subscriptions#usage-stats"
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full border border-indigo-500/20 hover:bg-indigo-500/5 transition-colors cursor-pointer"
      >
        <InfinityIcon className="w-3.5 h-3.5 text-purple-400" />
      </Link>
    );
  }

  // Determine color based on percentage
  let meterColor = "bg-emerald-500";
  let textColor = "text-emerald-400";
  let ringColor = "ring-emerald-500/20";

  if (isExhausted) {
    meterColor = "bg-red-500";
    textColor = "text-red-400";
    ringColor = "ring-red-500/20";
  } else if (percentage >= 80) {
    // 20% or less remaining corresponds to 80% used
    meterColor = "bg-red-500";
    textColor = "text-red-400";
    ringColor = "ring-red-500/20";
  } else if (percentage >= 50) {
    // 20-50% remaining corresponds to 50-80% used
    meterColor = "bg-amber-500";
    textColor = "text-amber-400";
    ringColor = "ring-amber-500/20";
  }

  return (
    <Link
      href="/settings/subscriptions#usage-stats"
      className="cursor-pointer"
      title={
        isExhausted
          ? "Quota reached. Resets tomorrow at midnight UTC."
          : `${remaining} of ${dailyLimit} tokens remaining`
      }
    >
      <span className="text-xs font-medium text-slate-300">
        <span className={textColor}>{remaining}</span> / {dailyLimit}
      </span>

      {isExhausted && (
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
        </span>
      )}
    </Link>
  );
}
