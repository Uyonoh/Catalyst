"use client";

import {
  Zap,
  MessageSquare,
  Sparkles,
  Palette,
  Terminal,
  Image as ImageIcon,
  Video,
} from "lucide-react";

import { useCatalog } from "../../context/CatalogContext";

const ICON_MAP: Record<string, any> = {
  chat: MessageSquare,
  auto_awesome: Sparkles,
  palette: Palette,
  terminal: Terminal,
  image: ImageIcon,
  video: Video,
};

export default function QuickAccessModels() {
  const { models } = useCatalog();

  // Map database colors to Tailwind classes (static mapping for purging safety)
  const colorMap: Record<string, string> = {
    green: "bg-green-500/20 text-green-400",
    purple: "bg-purple-500/20 text-purple-400",
    cyan: "bg-cyan-500/20 text-cyan-400",
    orange: "bg-orange-500/20 text-orange-400",
    pink: "bg-pink-500/20 text-pink-400",
    blue: "bg-blue-500/20 text-blue-400",
    yellow: "bg-yellow-500/20 text-yellow-400",
    rose: "bg-rose-500/20 text-rose-400",
  };
  return (
    <div
      className="glass-panel rounded-2xl p-6 mb-12 animate-slideDown"
      style={{ animationDelay: "0.1s", animationFillMode: "both" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg flex items-center gap-2">
          <Zap className="size-5 text-cyan-400" />
          Quick Access Models
        </h3>
        {/*<a className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer">
          Manage Models
        </a>*/}
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 dropdown-scroll">
        {models.map((model) => (
          <div
            key={model.slug}
            className="flex h-12 min-w-[150px] cursor-pointer hover:bg-white/5 transition-colors items-center gap-x-3 rounded-xl bg-white/5 border border-white/5 pl-3 pr-5 group"
          >
            <div
              className={`size-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${colorMap[model.color] || "bg-slate-500/20 text-slate-400"}`}
            >
              {(() => {
                const Icon = ICON_MAP[model.icon];
                return Icon ? <Icon className="size-5" /> : null;
              })()}
            </div>
            <div className="flex flex-col">
              <span className="text-white text-sm font-bold">
                {model.brief}
              </span>
              {/*<span className="text-slate-400 text-[10px] uppercase tracking-wider">
                {model.provider || "AI Model"}
              </span>*/}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
