"use client";

import { useState, useEffect } from "react";
import { useWorkspace } from "../../context/WorkspaceContext";
import GlassPanel from "../GlassPanel";
import {
  Aperture,
  Target,
  Ruler,
  Zap,
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
  Type,
  Workflow,
  HelpCircle,
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  shutter_speed: Aperture,
  ads_click: Target,
  straighten: Ruler,
  bolt: Zap,
};

export default function OptimizationSettings() {
  const { controls, setControls } = useWorkspace();

  const SETTINGS = [
    {
      id: "creativity",
      title: "Creativity",
      description: "Allow model to hallucinate details.",
      icon: "shutter_speed",
      color: "purple",
      defaultValue: controls.creativity ?? 0.75,
      type: "slider" as const,
    },
    {
      id: "precision",
      title: "Precision",
      description: "Adherence to raw intent.",
      icon: "ads_click",
      color: "cyan",
      defaultValue: controls.precision ?? 0.5,
      type: "slider" as const,
    },
    // {
    //   id: "token",
    //   title: "Token Usage",
    //   description: "450 / 1000 credits.",
    //   icon: "bolt",
    //   color: "slate",
    //   defaultValue: 45,
    //   type: "progress" as const,
    // },
  ];

  const [settings, setSettings] = useState(
    SETTINGS.reduce(
      (acc, setting) => {
        acc[setting.id] = setting.defaultValue;
        return acc;
      },
      {} as Record<string, number>,
    ),
  );
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
    const defaultSettings = SETTINGS.reduce(
      (acc, setting) => {
        acc[setting.id] = setting.defaultValue;
        return acc;
      },
      {} as Record<string, number>,
    );
    setSettings(defaultSettings);
  };

  const handleSliderChange = (id: string, value: number) => {
    setSettings((prev) => ({ ...prev, [id]: value }));
    setControls({ [id]: value });
  };

  const getLevelLabel = (value: number, type: string) => {
    if (type === "progress") return "2d Left";
    if (value > 66) return "High";
    if (value > 33) return "Medium";
    return "Low";
  };

  const getColorStyles = (color: string) => {
    const colorMap: Record<
      string,
      { bg: string; text: string; border: string; accent: string }
    > = {
      purple: {
        bg: "bg-purple-500/20",
        text: "text-purple-300",
        border: "border-purple-500/30",
        accent: "accent-purple-500",
      },
      cyan: {
        bg: "bg-cyan-500/20",
        text: "text-cyan-300",
        border: "border-cyan-500/30",
        accent: "accent-cyan-500",
      },
      green: {
        bg: "bg-green-500/20",
        text: "text-green-300",
        border: "border-green-500/30",
        accent: "accent-green-500",
      },
      slate: {
        bg: "bg-slate-800",
        text: "text-slate-400",
        border: "border-slate-500/30",
        accent: "accent-slate-500",
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

          {/* Mobile Toggle */}
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
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${showSettings ? "grid" : "hidden sm:grid"} animate-fadeIn`}
      >
        {SETTINGS.map((setting) => {
          const colors = getColorStyles(setting.color);
          const levelLabel = getLevelLabel(settings[setting.id], setting.type);

          return (
            <GlassPanel
              key={setting.id}
              hoverable
              className="p-5 rounded-xl cursor-default group border border-white/5 hover:border-cyan-500/30"
            >
              <div className="flex justify-between items-start mb-3">
                <div
                  className={`p-2 rounded-lg bg-[#1b2127] ${setting.color === "slate" ? "text-slate-400 group-hover:text-white" : `text-${setting.color}-400 group-hover:text-${setting.color}-300`} transition-colors`}
                  style={setting.color === "slate" ? {} : undefined}
                >
                  {(() => {
                    const Icon = ICON_MAP[setting.icon];
                    return Icon ? <Icon className="size-6" /> : null;
                  })()}
                </div>
                <span
                  className={`text-xs font-bold ${colors.bg} ${colors.text} px-2 py-1 rounded`}
                >
                  {levelLabel}
                </span>
              </div>

              <h3 className="text-white font-bold mb-1">{setting.title}</h3>
              <p className="text-slate-400 text-sm">{setting.description}</p>

              {setting.type === "slider" ? (
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings[setting.id]}
                  onChange={(e) =>
                    handleSliderChange(setting.id, parseInt(e.target.value))
                  }
                  className={`w-full mt-4 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer ${colors.accent}`}
                />
              ) : (
                <div className="w-full bg-slate-800 rounded-full h-1 mt-6">
                  <div
                    className="bg-cyan-500 h-1 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                    style={{ width: `${settings[setting.id]}%` }}
                  />
                </div>
              )}
            </GlassPanel>
          );
        })}

        {/* Length Toggle */}
        <GlassPanel
          hoverable
          className="p-5 rounded-xl cursor-default group border border-white/5 hover:border-cyan-500/30"
        >
          <div className="flex justify-between items-start mb-3">
            <div
              className={`p-2 rounded-lg bg-[#1b2127] text-emerald-400 group-hover:text-emerald-300 transition-colors`}
              style={{}}
            >
              <Type className="size-6" />
            </div>
            <span
              className={`text-xs font-bold bg-emerald-800/20 text-emerald-400 group-hover:text-emerald-300 px-2 py-1 rounded`}
            >
              {controls.length ?? "short"}
            </span>
          </div>

          <h3 className="text-white font-bold mb-1">Output Length</h3>
          <p className="text-slate-400 text-sm">
            Set the length of the prompt.
          </p>

          <div className="grid grid-cols-3 gap-2 w-full mt-6">
            {["short", "medium", "long"].map((l) => (
              <button
                key={l}
                onClick={() => setControls({ length: l as any })}
                className={`py-1.5 text-[10px] font-bold rounded-md border transition-all uppercase tracking-wider ${
                  controls.length === l
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                    : "bg-slate-900/50 border-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/5"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </GlassPanel>

        {/* Reasoning Strategy */}
        <GlassPanel
          hoverable
          className="p-5 rounded-xl cursor-default group border border-white/5 hover:border-cyan-500/30"
        >
          <div className="flex justify-between items-start mb-3">
            <div
              className={`p-2 rounded-lg bg-[#1b2127] text-amber-400 group-hover:text-amber-300 transition-colors`}
            >
              <Workflow className="size-6" />
            </div>
            <span
              className={`text-xs font-bold bg-amber-500/20 text-amber-400 group-hover:text-amber-300 px-2 py-1 rounded capitalize`}
            >
              {(controls.strategy ?? "default").replace("_", " ")}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mb-1">
            <h3 className="text-white font-bold text-sm">Reasoning Strategy</h3>
            <div className="group/info relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTooltip(
                    activeTooltip === "strategy" ? null : "strategy",
                  );
                }}
                className="focus:outline-none flex items-center justify-center p-0.5 -m-0.5"
                aria-label="Show strategy info"
              >
                <HelpCircle className="size-3.5 text-slate-500 hover:text-slate-400 cursor-help transition-colors" />
              </button>
              <div
                className={`absolute bottom-full -left-20 sm:left-1/2 sm:-translate-x-1/2 mb-2 ${
                  activeTooltip === "strategy"
                    ? "block"
                    : "hidden group-hover/info:block"
                } w-52 p-3 bg-[#0f172a] border border-white/10 rounded-xl text-[10px] text-slate-400 leading-relaxed z-50 shadow-2xl pointer-events-none animate-fadeIn`}
              >
                <div className="space-y-2">
                  <div>
                    <p className="font-bold text-amber-400 uppercase tracking-wider text-[9px] mb-0.5">
                      Standard
                    </p>
                    <p>Direct optimization. Best for simple prompts.</p>
                  </div>
                  <div className="pt-1 border-t border-white/5">
                    <p className="font-bold text-amber-400 uppercase tracking-wider text-[9px] mb-0.5">
                      Thought
                    </p>
                    <p>Explicit step-by-step reasoning before output.</p>
                  </div>
                </div>
                {/* Arrow */}
                <div className="absolute top-full left-1.5 sm:left-1/2 sm:-translate-x-1/2 border-8 border-transparent border-t-[#0f172a] hidden sm:block" />
              </div>
            </div>
          </div>
          <p className="text-slate-400 text-[11px]">Agent reasoning mode.</p>

          <div className="grid grid-cols-2 gap-2 w-full mt-6">
            {[
              { id: "default", label: "Standard" },
              { id: "chain_of_thought", label: "Thought" },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setControls({ strategy: s.id as any })}
                className={`py-1.5 text-[10px] font-bold rounded-md border transition-all uppercase tracking-wider ${
                  controls.strategy === s.id
                    ? "bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                    : "bg-slate-900/50 border-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/5"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </GlassPanel>
      </div>
    </>
  );
}
