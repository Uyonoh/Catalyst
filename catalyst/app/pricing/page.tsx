"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Check,
  Minus,
  ChevronDown,
  ChevronUp,
  TableProperties,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  TIERS,
  COMPARISON_ROWS,
  getPlanCategories,
  type Tier,
} from "../lib/plans";

export default function PublicPricingPage() {
  const [symbol, setSymbol] = useState<string>("$");
  const [currency, setCurrency] = useState<string>("USD");
  const [rate, setRate] = useState<number | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  useEffect(() => {
    const fetchSymbol = async () => {
      try {
        const response = await fetch("/api/detect-currency");
        const data = await response.json();
        setSymbol(data?.currencyData?.symbol ?? "$");
        setCurrency(data?.currencyData?.currency ?? "USD");
        if (
          data?.currencyData?.currency &&
          data.currencyData.currency !== "USD"
        ) {
          const rateResponse = await fetch(
            // `https://www.currencyexchangetool.com/api/v1/convert?from=USD&to=${data.currencyData.currency}&amount=1`
            `https://currency-exchange-api-hgi8.onrender.com/rates/USD/${data.currencyData.currency}`,
          );
          const rateData = await rateResponse.json();
          setRate(rateData?.rate ?? 1);
        }
      } catch (e) {
        console.error("Error detecting currency:", e);
      }
    };

    fetchSymbol();
  }, []);

  const calculateCharge = (tier: Tier) => {
    const price = tier.discountedPrice ? tier.discountedPrice : tier.price;
    return Number((price * (rate ?? 1)).toFixed(2));
  };

  const categories = getPlanCategories();

  const renderCellValue = (val: string | boolean | null, tierIdx: number) => {
    const tier = TIERS[tierIdx];
    if (val === true) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20">
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
    <>
      <Header />
      <main className="flex-1 w-full max-w-[1400px] mx-auto pt-16 pb-16 px-4 md:px-8 relative z-10">
        <div className="flex flex-col gap-10">
          {/* Header Section */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-wider uppercase">
              <Sparkles className="size-3.5" /> Flexible Plans
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
              Transparent Pricing for{" "}
              <span className="text-cyan-400">Every Creator</span>
            </h1>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed">
              Unlock maximum model precision, higher token limits, and advanced
              workspace collaboration tools.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-2">
            {TIERS.map((tier) => {
              const Icon = tier.icon;
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
                            ? "line-through text-slate-400 text-2xl font-bold"
                            : "text-white text-4xl font-extrabold"
                        }`}
                      >
                        ${tier.price}
                      </span>
                      {tier.discountedPrice !== null && (
                        <span className="text-white text-4xl font-extrabold tracking-tight">
                          ${tier.discountedPrice}
                        </span>
                      )}
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                        / {tier.period}
                      </span>
                    </div>

                    {symbol !== "$" &&
                      rate &&
                      tier.discountedPrice !== null && (
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-white text-2xl font-bold tracking-tight">
                            {symbol}
                            {"\u00A0"}
                            {calculateCharge(tier).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      )}

                    <p className="text-xs text-slate-400 leading-relaxed font-medium mt-1">
                      {tier.description}
                    </p>

                    <div className="h-px bg-white/5 my-2" />

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

                  {/* Action CTA redirecting to authenticated pricing page */}
                  <div className="mt-8">
                    <Link
                      href="/settings/subscriptions/pricing"
                      className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        tier.highlight
                          ? `${tier.bgClass} hover:${tier.hoverClass} text-black hover:-translate-y-0.5 active:scale-95 ${tier.glowClass}`
                          : `text-white ${tier.bgClass} hover:${tier.hoverClass} border border-white/10 hover:-translate-y-0.5 active:scale-95`
                      }`}
                    >
                      <span>Get Started</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Feature Comparison Section */}
          <div className="flex flex-col gap-0 rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md overflow-hidden mt-6">
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

            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                isCompareOpen
                  ? "max-h-[9999px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="border-t border-white/10 overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left px-6 py-4 w-56">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                          Feature
                        </span>
                      </th>
                      {TIERS.map((tier) => {
                        const Icon = tier.icon;
                        return (
                          <th
                            key={tier.tierKey}
                            className={`text-center px-4 py-4 ${
                              tier.highlight
                                ? "relative bg-gradient-to-b from-blue-500/5 to-transparent"
                                : ""
                            }`}
                          >
                            <div className="flex flex-col items-center gap-1.5">
                              <div
                                className={`p-1.5 rounded-lg bg-white/5 border ${tier.borderClass}`}
                              >
                                <Icon
                                  className={`size-3.5 ${tier.colorClass}`}
                                />
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

                          {rows.map((row, rowIdx) => (
                            <tr
                              key={`row-${catIdx}-${rowIdx}`}
                              className={`border-b border-white/5 hover:bg-white/[0.025] transition-colors group ${
                                rowIdx === rows.length - 1
                                  ? "border-white/10"
                                  : ""
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

                    <tr className="border-t border-white/10 bg-white/[0.02]">
                      <td className="px-6 py-5">
                        <span className="text-xs font-bold text-white">
                          Monthly Price
                        </span>
                      </td>
                      {TIERS.map((tier) => (
                        <td
                          key={tier.tierKey}
                          className={`text-center px-4 py-5 ${
                            tier.highlight ? "bg-blue-500/5" : ""
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex items-baseline gap-1 justify-center">
                              {tier.discountedPrice !== null ? (
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
                            <Link
                              href="/settings/subscriptions/pricing"
                              className={`w-full py-2 px-3 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                tier.highlight
                                  ? `${tier.bgClass} hover:${tier.hoverClass} text-black`
                                  : `text-white ${tier.bgClass} hover:${tier.hoverClass}`
                              }`}
                            >
                              Choose Plan
                            </Link>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
