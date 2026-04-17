"use client";

import { useState, useEffect } from "react";
import { useWorkspace } from "../../context/WorkspaceContext";
import GlassPanel from "../GlassPanel";
import {
  Aperture,
  Target,
  Zap,
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
  Type,
  Workflow,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";
import { PromptControls } from "../../lib/prompts/builder";

const ICON_MAP: Record<string, any> = {
  creativity: Aperture,
  precision: Target,
  length: Type,
  strategy: Workflow,
  failureHandling: ShieldCheck,
  bolt: Zap,
};

type SettingType = "slider" | "options" | "toggle";

interface Setting {
  id: keyof PromptControls;
  title: string;
  description: string;
  icon: string;
  color: "purple" | "cyan" | "emerald" | "amber" | "blue" | "slate";
  type: SettingType;
  options?: { id: string; label: string; info?: string }[];
}

const SETTINGS: Setting[] = [
  {
    id: "creativity",
    title: "Creativity",
    description: "Allow model to hallucinate details.",
    icon: "creativity",
    color: "purple",
    type: "slider",
  },
  {
    id: "precision",
    title: "Precision",
    description: "Adherence to raw intent.",
    icon: "precision",
    color: "cyan",
    type: "slider",
  },
  {
    id: "length",
    title: "Output Length",
    description: "Set the length of the prompt.",
    icon: "length",
    color: "emerald",
    type: "options",
    options: [
      { id: "short", label: "Short" },
      { id: "medium", label: "Medium" },
      { id: "long", label: "Long" },
    ],
  },
  {
    id: "failureHandling",
    title: "Robustness",
    description: "Resolve ambiguity with assumptions.",
    icon: "failureHandling",
    color: "blue",
    type: "toggle",
  },
  {
    id: "strategy",
    title: "Reasoning Strategy",
    description: "Agent reasoning mode.",
    icon: "strategy",
    color: "amber",
    type: "options",
    options: [
      {
        id: "default",
        label: "Standard",
        info: "Direct optimization. Best for simple prompts.",
      },
      {
        id: "chain_of_thought",
        label: "Thought",
        info: "Explicit step-by-step reasoning before output.",
      },
    ],
  },
];

export default function OptimizationSettings() {
  const { controls, setControls } = useWorkspace();
  const [showSettings, setShowSettings] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  useEffect(() => {
    const handleClose = () => setActiveTooltip(null);
    if (activeTooltip) {
      window.addEventListener("click", handleClose);
    }
    return () => window.removeEventListener("click", handleClose);
  }, [activeTooltip]);

  const handleReset = () => {
    setControls({
      creativity: 0.5,
      precision: 0.75,
      length: "short",
      strategy: "default",
      failureHandling: true,
    });
  };

  const getLevelLabel = (setting: Setting, value: any) => {
    if (setting.type === "slider") {
      const val = (value as number) * 100;
      if (val > 66) return "High";
      if (val > 33) return "Medium";
      return "Low";
    }
    if (setting.type === "toggle") {
      return value ? "Active" : "Off";
    }
    return value || "Default";
  };

  const getColorStyles = (color: string) => {
    const colorMap: Record<
      string,
      { bg: string; text: string; border: string; accent: string; glass: string }
    > = {
      purple: {
        bg: "bg-purple-500/20",
        text: "text-purple-300",
        border: "border-purple-500/30",
        accent: "accent-purple-500",
        glass: "text-purple-400 group-hover:text-purple-300",
      },
      cyan: {
        bg: "bg-cyan-500/20",
        text: "text-cyan-300",
        border: "border-cyan-500/30",
        accent: "accent-cyan-500",
        glass: "text-cyan-400 group-hover:text-cyan-300",
      },
      emerald: {
        bg: "bg-emerald-500/20",
        text: "text-emerald-300",
        border: "border-emerald-500/30",
        accent: "accent-emerald-500",
        glass: "text-emerald-400 group-hover:text-emerald-300",
      },
      amber: {
        bg: "bg-amber-500/20",
        text: "text-amber-300",
        border: "border-amber-500/30",
        accent: "accent-amber-500",
        glass: "text-amber-400 group-hover:text-amber-300",
      },
      blue: {
        bg: "bg-blue-500/20",
        text: "text-blue-300",
        border: "border-blue-500/30",
        accent: "accent-blue-500",
        glass: "text-blue-400 group-hover:text-blue-300",
      },
      slate: {
        bg: "bg-slate-800",
        text: "text-slate-400",
        border: "border-slate-500/30",
        accent: "accent-slate-500",
        glass: "text-slate-400 group-hover:text-white",
      },
    };
    return colorMap[color] || colorMap.slate;
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <SlidersHorizontal className="size-6 text-cyan-400" />
            Optimization Settings
          </h2>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="sm:hidden flex items-center gap-1 text-xs text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-full"
          >
            <span>{showSettings ? "Hide" : "Show"}</span>
            {showSettings ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </button>
        </div>

        <div
          className={`${showSettings ? "flex" : "hidden sm:flex"} items-center justify-between sm:justify-end gap-4`}
        >
          <button
            onClick={handleReset}
            className="text-sm text-cyan-400 font-medium hover:text-cyan-300 transition-colors"
          >
            Reset Defaults
          </button>
        </div>
      </div>

      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 ${showSettings ? "grid" : "hidden sm:grid"} animate-fadeIn`}
      >
        {SETTINGS.map((setting) => {
          const colors = getColorStyles(setting.color);
          const value = controls[setting.id];
          const Icon = ICON_MAP[setting.icon];
          const hasTooltip = setting.options?.some((o) => o.info);

          return (
            <GlassPanel
              key={setting.id}
              hoverable
              className="p-5 rounded-xl cursor-default group border border-white/5 hover:border-cyan-500/30"
            >
              <div className="flex justify-between items-start mb-3">
                <div
                  className={`p-2 rounded-lg bg-[#1b2127] ${colors.glass} transition-colors`}
                >
                  {Icon && <Icon className="size-6" />}
                </div>
                <span
                  className={`text-xs font-bold ${colors.bg} ${colors.text} px-2 py-1 rounded capitalize`}
                >
                  {getLevelLabel(setting, value)}
                </span>
              </div>

              <div className="flex items-center gap-1.5 mb-1">
                <h3 className="text-white font-bold text-sm">{setting.title}</h3>
                {hasTooltip && (
                  <div className="group/info relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTooltip(
                          activeTooltip === setting.id ? null : setting.id,
                        );
                      }}
                      className="focus:outline-none flex items-center justify-center p-0.5 -m-0.5"
                    >
                      <HelpCircle className="size-3.5 text-slate-500 hover:text-slate-400 cursor-help transition-colors" />
                    </button>
                    <div
                      className={`absolute bottom-full -left-20 sm:left-1/2 sm:-translate-x-1/2 mb-2 ${
                        activeTooltip === setting.id
                          ? "block"
                          : "hidden group-hover/info:block"
                      } w-52 p-3 bg-[#0f172a] border border-white/10 rounded-xl text-[10px] text-slate-400 leading-relaxed z-50 shadow-2xl pointer-events-none animate-fadeIn`}
                    >
                      <div className="space-y-2">
                        {setting.options
                          ?.filter((o) => o.info)
                          .map((o) => (
                            <div
                              key={o.id}
                              className="not-first:pt-1 not-first:border-t not-first:border-white/5"
                            >
                              <p
                                className={`font-bold ${colors.text} uppercase tracking-wider text-[9px] mb-0.5`}
                              >
                                {o.label}
                              </p>
                              <p>{o.info}</p>
                            </div>
                          ))}
                      </div>
                      <div className="absolute top-full left-1.5 sm:left-1/2 sm:-translate-x-1/2 border-8 border-transparent border-t-[#0f172a] hidden sm:block" />
                    </div>
                  </div>
                )}
              </div>
              <p className="text-slate-400 text-[11px]">{setting.description}</p>

              <div className="mt-6">
                {setting.type === "slider" && (
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={(value as number) * 100}
                    onChange={(e) =>
                      setControls({ [setting.id]: parseInt(e.target.value) / 100 })
                    }
                    className={`w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer ${colors.accent}`}
                  />
                )}

                {setting.type === "options" && (
                  <div
                    className={`grid gap-2 w-full animate-fadeIn`}
                    style={{
                      gridTemplateColumns: `repeat(${setting.options?.length || 1}, minmax(0, 1fr))`,
                    }}
                  >
                    {setting.options?.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setControls({ [setting.id]: opt.id })}
                        className={`py-1.5 text-[10px] font-bold rounded-md border transition-all uppercase tracking-wider ${
                          value === opt.id
                            ? `${colors.bg} ${colors.border.replace("/30", "/50")} ${colors.text} shadow-[0_0_10px_rgba(0,0,0,0.2)]`
                            : "bg-slate-900/50 border-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/5"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}

                {setting.type === "toggle" && (
                  <button
                    onClick={() => setControls({ [setting.id]: !value })}
                    className={`w-full py-2 text-[10px] font-bold rounded-md border transition-all uppercase tracking-wider ${
                      value
                        ? `${colors.bg} ${colors.border.replace("/30", "/50")} ${colors.text}`
                        : "bg-slate-900/50 border-white/5 text-slate-500"
                    }`}
                  >
                    {value ? "Enabled" : "Disabled"}
                  </button>
                )}
              </div>
            </GlassPanel>
          );
        })}
      </div>
    </>
  );
}
