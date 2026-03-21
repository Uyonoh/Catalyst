"use client";

export default function StatsOverview() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 animate-slideDown" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
      <div className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-black text-white mb-1 tracking-tight">128</span>
        <span className="text-xs text-slate-400 uppercase tracking-wider">
          Prompts Created
        </span>
      </div>
      <div className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-black text-[--color-primary] mb-1 tracking-tight">
          86%
        </span>
        <span className="text-xs text-slate-400 uppercase tracking-wider">
          Optimization Rate
        </span>
      </div>
      <div className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-black text-cyan-400 mb-1 tracking-tight">4.2s</span>
        <span className="text-xs text-slate-400 uppercase tracking-wider">
          Avg Latency
        </span>
      </div>
      <div className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-black text-purple-400 mb-1 tracking-tight">12</span>
        <span className="text-xs text-slate-400 uppercase tracking-wider">
          Active Projects
        </span>
      </div>
    </div>
  );
}
