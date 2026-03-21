"use client";
import GlassPanel from "./GlassPanel";

export default function Header() {
  const x = {
    id: "token",
    title: "Token Usage",
    description: "450 / 1000 credits.",
    icon: "bolt",
    color: "slate",
    defaultValue: 45,
    type: "progress" as const,
  };

  return (
    <header className="flex justify-between">
      <div className="flex flex-col gap-">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
          Catalyst Workspace
        </h1>
        <p className="text-slate-400 text-base md:text-lg">
          Transform your raw ideas into optimized prompts with live analysis.
        </p>
      </div>
    </header>
  );
}

<GlassPanel
  hoverable
  className="p-5 rounded-xl cursor-pointer group border border-white/5 hover:border-cyan-500/30"
>
  <div className="flex justify-between items-start mb-3">
    <div
      className={`p-2 rounded-lg bg-[#1b2127] text-slate-400 group-hover:text-white transition-colors`}
      style={{}}
    >
      <span className="material-symbols-outlined text-sm">{"bolt"}</span>
    </div>
    <span
      className={`text-xs font-bold bg-slate-800 text-slate-400 px-2 py-1 rounded`}
    >
      {"2d Left"}
    </span>
  </div>

  {/* <h3 className="text-white font-bold mb-1">{"Token Usage"}</h3> */}
  <p className="text-slate-400 text-sm">{"450 / 1000 credits."}</p>

  <div className="w-full bg-slate-800 rounded-full h-1 mt-6">
    <div
      className="bg-cyan-500 h-1 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"
      style={{ width: `45%` }}
    />
  </div>
</GlassPanel>;
