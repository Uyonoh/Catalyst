"use client";

import { useState, useEffect } from "react";
import {
  Check,
  Sparkles,
  Orbit,
  Aperture,
  Activity,
  Infinity,
  Zap,
  Shield,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "../../../context/AuthContext";

const TIERS = [
  {
    name: "Free",
    alias: "Spark",
    price: 0,
    discountedPrice: null,
    period: "forever",
    description:
      "Ideal for beginners and hobbyists seeking core prompt optimization tools.",
    features: [
      "Access to standard models (GPT-3.5, Gemini Flash)",
      "100 monthly token limit",
      "Up to 20 saved prompts",
    ],
    cta: "Default Plan",
    tierKey: "free",
    highlight: false,
    icon: Zap,
    colorClass: "text-slate-400",
    borderClass: "border-white/10",
    bgClass: "bg-slate-500",
    hoverClass: "bg-slate-400 text-white",
    glowClass: "",
  },
  {
    name: "Basic",
    alias: "Orbit",
    price: 3,
    discountedPrice: 1,
    period: "per month",
    description:
      "Designed for professionals, power prompt engineers, and advanced creators.",
    features: [
      "access to premium models (gpt-4o, claude opus, midjourney v6)",
      "up to 50 saved prompts",
      "up to 3 managed workspaces",
      "100 weekly token limit",
    ],
    cta: "Switch to Basic",
    tierKey: "basic",
    highlight: false,
    icon: Orbit,
    colorClass: "text-cyan-400",
    borderClass: "border-cyan-500/30",
    bgClass: "bg-cyan-500",
    hoverClass: "bg-cyan-400",
    glowClass: "shadow-[0_0_30px_rgba(6,182,212,0.15)]",
  },
  {
    name: "Plus",
    alias: "Nova",
    price: 7,
    discountedPrice: 3,
    period: "per month",
    description:
      "designed for professionals, power prompt engineers, and advanced creators.",
    cta: "Switch to Plus",
    features: [
      "access to premium models (gpt-4o, claude opus, midjourney v6)",
      "up to 100 saved prompts",
      "up to 10 managed workspaces",
      "250 weekly token limit",
    ],
    tierKey: "plus",
    highlight: true,
    icon: Aperture,
    colorClass: "text-blue-300",
    borderClass: "border-blue-400/30",
    bgClass: "bg-blue-400",
    hoverClass: "bg-blue-300",
    glowClass: "shadow-[0_0_30px_rgba(59,130,246,0.15)]",
  },
  {
    name: "Pro",
    alias: "Pulsar",
    price: 12,
    discountedPrice: 5,
    period: "per month",
    description:
      "Built for studios, agencies, and high-frequency production systems.",
    features: [
      "access to premium models (gpt-4o, claude opus, midjourney v6)",
      "up to 200 saved prompts",
      "up to 30 managed workspaces",
      "300 weekly token limit",
    ],
    cta: "Switch to Pro",
    tierKey: "pro",
    highlight: false,
    icon: Activity,
    colorClass: "text-amber-400", // Closest match to gold
    borderClass: "border-yellow-500/20",
    bgClass: "bg-amber-500",
    hoverClass: "bg-amber-400",

    glowClass: "shadow-[0_0_30px_rgba(245,158,11,0.15)]",
  },
  {
    name: "Ultra",
    alias: "Infinity",
    price: 20,
    discountedPrice: 10,
    period: "per month",
    description:
      "Built for studios, agencies, and high-frequency production systems.",
    // features: [
    //   "Unlimited daily tokens (zero limit)",
    //   "Access to ultra-advanced & fine-tuned custom models",
    //   "Dedicated high-speed rendering pipelines",
    //   "Enterprise analytics and log audits",
    //   "Dedicated customer support manager",
    //   "Custom integration features",
    // ],
    features: [
      "access to premium models (gpt-4o, claude opus, midjourney v6)",
      "Unlimited saved prompts",
      "Unlimited managed workspaces",
      "Unlimited tokens",
    ],
    cta: "Switch to Ultra",
    tierKey: "ultra",
    highlight: false,
    icon: Infinity,
    colorClass: "text-purple-400",
    borderClass: "border-purple-500/20",
    bgClass: "bg-purple-500",
    hoverClass: "bg-purple-400",
    glowClass: "shadow-[0_0_30px_rgba(168,85,247,0.1)]",
  },
];

async function getUserCurrency() {
  const response = await fetch("/api/detect-currency");
  const data = await response.json();

  return data.currencyData;
}

export default function PricingPage() {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [symbol, setSymbol] = useState<string | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const { profile } = useUser();
  const currentPlan = profile?.plan ?? "free";

  useEffect(() => {
    const fetchSymbol = async () => {
      const response = await fetch("/api/detect-currency");
      const data = await response.json();
      setSymbol(data.currencyData.symbol ?? "$");
      // console.log("CUR: ", data.currencyData);
      const rateResponse = await fetch(
        `https://www.currencyexchangetool.com/api/v1/convert?from=USD&to=${data.currencyData.currency}&amount=1`,
      );
      const rateData = await rateResponse.json();
      setRate(rateData.rate);
    };

    fetchSymbol();
  }, []);

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
        throw new Error(
          result.message || "Something went wrong. Please try again.",
        );
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
        <h2 className="text-3xl font-black text-white tracking-tight">
          Subscription Plans
        </h2>
        <p className="text-slate-400 text-sm max-w-xl">
          Choose the billing plan that fits your prompt development lifecycle.
          Scale up or cancel at any time.
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
          const isCurrentPlan = tier.tierKey === currentPlan; // For UI demo context
          if (!tier.borderClass) {
            console.error(
              `Tier ${tier.name} has no border set: ${JSON.stringify(tier)}`,
            );
          }

          return (
            <div
              key={tier.name}
              className={`relative flex flex-col justify-between p-6 sm:p-8 rounded-3xl border bg-black/20 backdrop-blur-md transition-all duration-300 ${tier.borderClass} ${tier.glowClass} ${
                tier.highlight ? "scale-100 xl:scale-[1.03] z-10" : ""
              }`}
            >
              {tier.highlight && (
                <div
                  className={`absolute -top-3.5 right-6 px-3.5 py-1 ${tier.bgClass} text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(6,182,212,0.4)]`}
                >
                  Most Popular
                </div>
              )}

              <div className="flex flex-col gap-5">
                <h2
                  className={`text-center text-2xl font-bold leading-none ${tier.colorClass}`}
                >
                  {tier.alias}
                </h2>
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl bg-white/5 border border-white/5`}
                  >
                    <Icon className={`size-5 ${tier.colorClass}`} />
                  </div>
                  <h3
                    className={`text-lg font-bold ${tier.colorClass} leading-none`}
                  >
                    {tier.name}
                  </h3>
                </div>

                <div className="flex items-baseline gap-1 mt-2">
                  <span
                    className={`tracking-tight ${
                      tier.discountedPrice
                        ? "line-through text-slate-400 text-2xl text-bold"
                        : "text-white text-4xl font-extrabold "
                    }`}
                  >
                    ${tier.price}
                  </span>
                  {tier.discountedPrice && (
                    <span className="text-white text-4xl font-extrabold trackiing-tight">
                      ${tier.discountedPrice}
                    </span>
                  )}
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    / {tier.period}
                  </span>
                </div>
                {symbol != "$" && rate && tier.discountedPrice && (
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-white text-2xl font-bold trackiing-tight">
                      {symbol}
                      {"\u00A0"}
                      {(tier.discountedPrice * rate).toLocaleString("en-us")}
                    </span>
                  </div>
                )}

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
                    Active Plan
                  </div>
                ) : (
                  <button
                    onClick={() => handleSubscribe(tier.tierKey)}
                    disabled={loadingTier !== null}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      tier.highlight
                        ? `${tier.bgClass} hover:${tier.hoverClass} text-black hover:-translate-y-0.5 active:scale-95 ${tier.glowClass}`
                        : `text-white ${tier.bgClass} hover:${tier.hoverClass} border border-white/10  hover:-translate-y-0.5 active:scale-95`
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
