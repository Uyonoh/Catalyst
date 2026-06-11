"use client";

interface StatsOverviewProps {
  promptsCount: number;
  workspacesCount: number;
  publicPromptsCount: number;
  favoritesCount: number;
}

export default function StatsOverview({
  promptsCount = 0,
  workspacesCount = 0,
  publicPromptsCount = 0,
  favoritesCount = 0,
}: StatsOverviewProps) {
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-slideDown"
      style={{ animationDelay: "0.2s", animationFillMode: "both" }}
    >
      <div className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center text-center border border-white/5 hover:border-cyan-500/20 hover:bg-white/5 transition-all group">
        <span className="text-3xl font-black text-white mb-1 tracking-tight group-hover:scale-105 transition-transform">
          {promptsCount}
        </span>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          Prompts Created
        </span>
      </div>
      <div className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center text-center border border-white/5 hover:border-[--color-primary]/20 hover:bg-white/5 transition-all group">
        <span className="text-3xl font-black text-[--color-primary] mb-1 tracking-tight group-hover:scale-105 transition-transform">
          {workspacesCount}
        </span>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          Active Workspaces
        </span>
      </div>
      <div className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center text-center border border-white/5 hover:border-amber-500/20 hover:bg-white/5 transition-all group">
        <span className="text-3xl font-black text-amber-400 mb-1 tracking-tight group-hover:scale-105 transition-transform">
          {favoritesCount}
        </span>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          Favorite Prompts
        </span>
      </div>
      <div className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center text-center border border-white/5 hover:border-purple-500/20 hover:bg-white/5 transition-all group">
        <span className="text-3xl font-black text-purple-400 mb-1 tracking-tight group-hover:scale-105 transition-transform">
          {publicPromptsCount}
        </span>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          Public Prompts
        </span>
      </div>
    </div>
  );
}
