"use client";

import { useState, useEffect } from "react";
import { type LucideIcon } from "lucide-react";
import {
  Check,
  Minus,
  Orbit,
  Aperture,
  Activity,
  Infinity,
  Zap,
  Loader2,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  TableProperties,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "../../../context/AuthContext";

interface Tier {
  name: string;
  alias: string;
  price: number;
  discountedPrice: number | null;
  period: string;
  description: string;
  features: string[];
  cta: string;
  tierKey: string;
  highlight: boolean;
  icon: LucideIcon;
  colorClass: string;
  borderClass: string;
  bgClass: string;
  hoverClass: string;
  glowClass: string;
}

const TIERS: Tier[] = [
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
      "25 weekly token limit",
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
      "Access to premium models (GPT-4o, Claude Opus, Midjourney v6)",
      "Up to 50 saved prompts",
      "Up to 3 managed workspaces",
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
      "Designed for professionals, power prompt engineers, and advanced creators.",
    cta: "Switch to Plus",
    features: [
      "Access to premium models (GPT-4o, Claude Opus, Midjourney v6)",
      "Up to 100 saved prompts",
      "Up to 10 managed workspaces",
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
      "Access to premium models (GPT-4o, Claude Opus, Midjourney v6)",
      "Up to 200 saved prompts",
      "Up to 30 managed workspaces",
      "500 weekly token limit",
    ],
    cta: "Switch to Pro",
    tierKey: "pro",
    highlight: false,
    icon: Activity,
    colorClass: "text-amber-400",
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
    features: [
      "Access to premium models (GPT-4o, Claude Opus, Midjourney v6)",
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

// Comparison table data
interface ComparisonRow {
  category: string;
  feature: string;
  values: (string | boolean | null)[];
}

const COMPARISON_ROWS: ComparisonRow[] = [
  // Usage
  {
    category: "Usage Limits",
    feature: "Weekly Tokens",
    values: ["25", "100", "250", "500", "Unlimited"],
  },
  {
    category: "Usage Limits",
    feature: "Saved Prompts",
    values: ["20", "50", "100", "200", "Unlimited"],
  },
  {
    category: "Usage Limits",
    feature: "Managed Workspaces",
    values: [false, "3", "10", "30", "Unlimited"],
  },

  // Models
  {
    category: "AI Models",
    feature: "Standard Models (GPT-3.5, Gemini Flash)",
    values: [true, true, true, true, true],
  },
  {
    category: "AI Models",
    feature: "Premium Models (GPT-4o, Claude Opus)",
    values: [false, true, true, true, true],
  },
  {
    category: "AI Models",
    feature: "Ultra-Advanced & Fine-Tuned Models",
    values: [false, false, false, false, true],
  },

  // Features
  {
    category: "Features",
    feature: "Prompt Optimization",
    values: [true, true, true, true, true],
  },
  {
    category: "Features",
    feature: "Prompt History",
    values: [true, true, true, true, true],
  },
  {
    category: "Features",
    feature: "Workspace Collaboration",
    values: [false, true, true, true, true],
  },
  {
    category: "Features",
    feature: "Analytics & Insights",
    values: [false, false, true, true, true],
  },
  {
    category: "Features",
    feature: "Enterprise Audit Logs",
    values: [false, false, false, true, true],
  },
  {
    category: "Features",
    feature: "Custom Integrations",
    values: [false, false, false, false, true],
  },

  // Support
  {
    category: "Support",
    feature: "Community Support",
    values: [true, true, true, true, true],
  },
  {
    category: "Support",
    feature: "Email Support",
    values: [false, true, true, true, true],
  },
  {
    category: "Support",
    feature: "Priority Support",
    values: [false, false, true, true, true],
  },
  {
    category: "Support",
    feature: "Dedicated Account Manager",
    values: [false, false, false, false, true],
  },
];

export default function PricingPage() {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [symbol, setSymbol] = useState<string>("$");
  const [currency, setCurrency] = useState<string>("USD");
  const [rate, setRate] = useState<number | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const { profile } = useUser();
  const currentPlan = profile?.plan ?? "free";

  useEffect(() => {
    const fetchSymbol = async () => {
      const response = await fetch("/api/detect-currency");
      const data = await response.json();
      setSymbol(data?.currencyData?.symbol ?? "$");
      setCurrency(data?.currencyData?.currency ?? "USD");
      const rateResponse = await fetch(
        `https://www.currencyexchangetool.com/api/v1/convert?from=USD&to=${data.currencyData.currency}&amount=1`,
      );
      const rateData = await rateResponse.json();
      setRate(rateData?.rate ?? 1);
    };

    fetchSymbol();
  }, []);

  const calculateCharge = (tier: Tier) => {
    const price = tier.discountedPrice ? tier.discountedPrice : tier.price;
    return Number((price * rate).toFixed(2));
  };

  const handleSubscribe = async (
    tier: string,
    currency: string,
    amount: number,
    baseAmount: number,
  ) => {
    if (tier === "free") return;
    setLoadingTier(tier);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/billing/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, currency, amount, baseAmount }),
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

  // Group comparison rows by category
  const categories = Array.from(
    new Set(COMPARISON_ROWS.map((r) => r.category)),
  );

  const renderCellValue = (val: string | boolean | null, tierIdx: number) => {
    const tier = TIERS[tierIdx];
    if (val === true) {
      return (
        <span
          className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20`}
        >
          <Check className="size-3 text-emerald-400" />
        </span>
      );
    }
    if (val === false || val === null) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/5 border border-white/10">
          <Minus className="size-3 text-slate-600" />
        </span>
      );
    }
    // String value
    const isUnlimited = val === "Unlimited";
    return (
      <span
        className={`text-xs font-bold ${
          isUnlimited ? tier.colorClass : "text-slate-200"
        }`}
      >
        {val}
      </span>
    );
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

      {/* ── Pricing Cards Section ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-4">
        {TIERS.map((tier) => {
          const Icon = tier.icon;
          const isCurrentPlan = tier.tierKey === currentPlan;

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
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
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
                        : "text-white text-4xl font-extrabold"
                    }`}
                  >
                    ${tier.price}
                  </span>
                  {tier.discountedPrice && (
                    <span className="text-white text-4xl font-extrabold tracking-tight">
                      ${tier.discountedPrice}
                    </span>
                  )}
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    / {tier.period}
                  </span>
                </div>
                {symbol !== "$" && rate && tier.discountedPrice && (
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-white text-2xl font-bold tracking-tight">
                      {symbol}
                      {"\u00A0"}
                      {calculateCharge(tier).toLocaleString("en-us", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
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
                    onClick={() =>
                      handleSubscribe(
                        tier.tierKey,
                        currency,
                        calculateCharge(tier),
                        tier.price,
                      )
                    }
                    disabled={loadingTier !== null}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      tier.highlight
                        ? `${tier.bgClass} hover:${tier.hoverClass} text-black hover:-translate-y-0.5 active:scale-95 ${tier.glowClass}`
                        : `text-white ${tier.bgClass} hover:${tier.hoverClass} border border-white/10 hover:-translate-y-0.5 active:scale-95`
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

      {/* ── Plan Comparison Table ── */}
      <div className="flex flex-col gap-0 rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md overflow-hidden">
        {/* Comparison table toggle header */}
        <button
          onClick={() => setIsCompareOpen((v) => !v)}
          className="flex items-center justify-between w-full px-6 py-4 group hover:bg-white/5 transition-colors"
          aria-expanded={isCompareOpen}
        >
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors">
              <TableProperties className="size-4 text-slate-400 group-hover:text-white transition-colors" />
            </div>
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                Compare Plans & Features
              </span>
              <span className="text-xs text-slate-500">
                Detailed breakdown across all {TIERS.length} tiers
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1">
              {TIERS.map((t) => (
                <span
                  key={t.tierKey}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${t.borderClass} ${t.colorClass} bg-white/5`}
                >
                  {t.alias}
                </span>
              ))}
            </div>
            <div className="p-1 rounded-md bg-white/5 border border-white/10 group-hover:border-white/20 transition-all ml-2">
              {isCompareOpen ? (
                <ChevronUp className="size-3.5 text-slate-400 group-hover:text-white transition-colors" />
              ) : (
                <ChevronDown className="size-3.5 text-slate-400 group-hover:text-white transition-colors" />
              )}
            </div>
          </div>
        </button>

        {/* Table content */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isCompareOpen ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-white/10 overflow-x-auto">
            <table className="w-full min-w-[640px]">
              {/* Column headers */}
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-6 py-4 w-56">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Feature
                    </span>
                  </th>
                  {TIERS.map((tier) => {
                    const Icon = tier.icon;
                    const isCurrentPlan = tier.tierKey === currentPlan;
                    return (
                      <th
                        key={tier.tierKey}
                        className={`text-center px-4 py-4 ${
                          tier.highlight
                            ? "relative bg-gradient-to-b from-blue-500/5 to-transparent"
                            : ""
                        }`}
                      >
                        {tier.highlight && (
                          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
                        )}
                        <div className="flex flex-col items-center gap-1.5">
                          <div
                            className={`p-1.5 rounded-lg bg-white/5 border ${tier.borderClass}`}
                          >
                            <Icon className={`size-3.5 ${tier.colorClass}`} />
                          </div>
                          <span
                            className={`text-xs font-extrabold ${tier.colorClass}`}
                          >
                            {tier.alias}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {tier.name}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {categories.map((category, catIdx) => {
                  const rows = COMPARISON_ROWS.filter(
                    (r) => r.category === category,
                  );
                  return (
                    <>
                      {/* Category header row */}
                      <tr
                        key={`cat-${catIdx}`}
                        className="border-b border-white/5"
                      >
                        <td
                          colSpan={TIERS.length + 1}
                          className="px-6 py-2.5 bg-white/[0.02]"
                        >
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                            {category}
                          </span>
                        </td>
                      </tr>

                      {/* Feature rows */}
                      {rows.map((row, rowIdx) => (
                        <tr
                          key={`row-${catIdx}-${rowIdx}`}
                          className={`border-b border-white/5 hover:bg-white/[0.025] transition-colors group ${
                            rowIdx === rows.length - 1 ? "border-white/10" : ""
                          }`}
                        >
                          <td className="px-6 py-3.5">
                            <span className="text-xs text-slate-400 group-hover:text-slate-300 font-medium transition-colors">
                              {row.feature}
                            </span>
                          </td>
                          {row.values.map((val, tierIdx) => {
                            const tier = TIERS[tierIdx];
                            return (
                              <td
                                key={tierIdx}
                                className={`text-center px-4 py-3.5 ${
                                  tier.highlight
                                    ? "bg-blue-500/[0.03] group-hover:bg-blue-500/[0.06]"
                                    : ""
                                } transition-colors`}
                              >
                                {renderCellValue(val, tierIdx)}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </>
                  );
                })}

                {/* Price row */}
                <tr className="border-t border-white/10 bg-white/[0.02]">
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold text-white">
                      Monthly Price
                    </span>
                  </td>
                  {TIERS.map((tier) => {
                    const isCurrentPlan = tier.tierKey === currentPlan;
                    return (
                      <td
                        key={tier.tierKey}
                        className={`text-center px-4 py-5 ${tier.highlight ? "bg-blue-500/5" : ""}`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex items-baseline gap-1 justify-center">
                            {tier.discountedPrice ? (
                              <>
                                <span className="text-slate-500 line-through text-xs font-medium">
                                  ${tier.price}
                                </span>
                                <span
                                  className={`text-lg font-extrabold ${tier.colorClass}`}
                                >
                                  ${tier.discountedPrice}
                                </span>
                              </>
                            ) : (
                              <span
                                className={`text-lg font-extrabold ${tier.colorClass}`}
                              >
                                ${tier.price}
                              </span>
                            )}
                          </div>
                          {isCurrentPlan ? (
                            <div className="w-full text-center py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-slate-400 cursor-not-allowed">
                              Active Plan
                            </div>
                          ) : (
                            <button
                              onClick={() =>
                                handleSubscribe(
                                  tier.tierKey,
                                  currency,
                                  calculateCharge(tier),
                                  tier.price,
                                )
                              }
                              disabled={
                                loadingTier !== null || tier.tierKey === "free"
                              }
                              className={`w-full py-2 px-3 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                tier.highlight
                                  ? `${tier.bgClass} hover:${tier.hoverClass} text-black`
                                  : `text-white ${tier.bgClass} hover:${tier.hoverClass}`
                              } disabled:opacity-40 disabled:cursor-not-allowed`}
                            >
                              {loadingTier === tier.tierKey ? (
                                <Loader2 className="size-3 animate-spin" />
                              ) : tier.tierKey === "free" ? (
                                "Default"
                              ) : (
                                tier.cta
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
