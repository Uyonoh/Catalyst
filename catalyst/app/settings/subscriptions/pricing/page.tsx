"use client";

import { useState } from "react";
import { Check, Sparkles, Zap, Shield, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

const TIERS = [
  {
    name: "Free Tier",
    price: "$0",
    period: "forever",
    description: "Ideal for beginners and hobbyists seeking core prompt optimization tools.",
    features: [
      "Access to standard models (GPT-3.5, Gemini Flash)",
      "Up to 50 optimized prompts total",
      "Up to 5 workspace folders",
      "1,000 daily token limit",
      "Basic live analyses",
    ],
    cta: "Current Plan",
    tierKey: "free",
    highlight: false,
    icon: Zap,
    colorClass: "text-slate-400",
    borderClass: "border-white/10",
    glowClass: "",
  },
 {
    name: "Basic Tier",
    price: "$10",
    period: "per month",
    description: "Designed for professionals, power prompt engineers, and advanced creators.",
    features: [
      "Access to premium models (GPT-4o, Claude Opus, Midjourney v6)",
      "Unlimited optimized prompts",
      "Unlimited workspace folders",
      "50,000 daily token limit",
      "Deep Intent & live NLP analysis",
      "Priority prompt rendering queue",
    ],
    cta: "Upgrade to Pro",
    tierKey: "pro",
    highlight: true,
    icon: Sparkles,
    colorClass: "text-cyan-400",
    borderClass: "border-cyan-500/30",
    glowClass: "shadow-[0_0_30px_rgba(6,182,212,0.15)]",
  },

  {
    name: "Pro Tier",
    price: "$20",
    period: "per month",
    description: "Designed for professionals, power prompt engineers, and advanced creators.",
    features: [
      "Access to premium models (GPT-4o, Claude Opus, Midjourney v6)",
      "Unlimited optimized prompts",
      "Unlimited workspace folders",
      "50,000 daily token limit",
      "Deep Intent & live NLP analysis",
      "Priority prompt rendering queue",
    ],
    cta: "Upgrade to Pro",
    tierKey: "pro",
    highlight: false,
    icon: Sparkles,
    colorClass: "text-cyan-400",
    borderClass: "border-cyan-500/30",
    glowClass: "shadow-[0_0_30px_rgba(6,182,212,0.15)]",
  },
  {
    name: "Enterprise Tier",
    price: "$50",
    period: "per month",
    description: "Built for studios, agencies, and high-frequency production systems.",
    features: [
      "Unlimited daily tokens (zero limit)",
      "Access to ultra-advanced & fine-tuned custom models",
      "Dedicated high-speed rendering pipelines",
      "Enterprise analytics and log audits",
      "Dedicated customer support manager",
      "Custom integration features",
    ],
    cta: "Upgrade to Enterprise",
    tierKey: "enterprise",
    highlight: false,
    icon: Shield,
    colorClass: "text-purple-400",
    borderClass: "border-purple-500/20",
    glowClass: "shadow-[0_0_30px_rgba(168,85,247,0.1)]",
  },
];

export default function PricingPage() {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubscribe = async (tier: string) => {
    if (tier === "free") return;
    setLoadingTier(tier);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/billing/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tier }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong. Please try again.");
      }

      if (result.url) {
        window.location.href = result.url;
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to initiate subscription flow.");
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Back navigation */}
      <div className="flex items-center gap-2">
        <Link
          href="/settings/subscriptions"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-white tracking-tight">Subscription Plans</h2>
        <p className="text-slate-400 text-sm max-w-xl">
          Choose the billing plan that fits your prompt development lifecycle. Scale up or cancel at any time.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm font-medium">
          {errorMsg}
        </div>
      )}

      {/* Grid of pricing cards */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-4">
        {TIERS.map((tier) => {
          const Icon = tier.icon;
          const isCurrentPlan = tier.tierKey === "free"; // For UI demo context

          return (
            <div
              key={tier.name}
              className={`relative flex flex-col justify-between p-6 sm:p-8 rounded-3xl border bg-black/20 backdrop-blur-md transition-all duration-300 ${tier.borderClass} ${tier.glowClass} ${
                tier.highlight ? "scale-100 xl:scale-[1.03] z-10" : ""
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3.5 right-6 px-3.5 py-1 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                  Most Popular
                </div>
              )}

              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-white/5 border border-white/5`}>
                    <Icon className={`size-5 ${tier.colorClass}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white leading-none">{tier.name}</h3>
                </div>

                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-extrabold text-white tracking-tight">{tier.price}</span>
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    / {tier.period}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-medium mt-1">
                  {tier.description}
                </p>

                <div className="h-px bg-white/5 my-2" />

                {/* Features List */}
                <ul className="flex flex-col gap-3">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="p-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                        <Check className="size-3" />
                      </div>
                      <span className="text-xs text-slate-300 font-medium leading-normal">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-8">
                {isCurrentPlan ? (
                  <div className="w-full text-center py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-400 cursor-not-allowed">
                    Default Active Plan
                  </div>
                ) : (
                  <button
                    onClick={() => handleSubscribe(tier.tierKey)}
                    disabled={loadingTier !== null}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      tier.highlight
                        ? "bg-cyan-500 hover:bg-cyan-400 text-black hover:-translate-y-0.5 active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                        : "bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:-translate-y-0.5 active:scale-95"
                    } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                  >
                    {loadingTier === tier.tierKey ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      tier.cta
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
