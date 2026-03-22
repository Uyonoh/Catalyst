"use client";

const MODELS = [
  {
    name: "GPT-4",
    provider: "OpenAI",
    icon: "chat",
    colorClass: "bg-green-500/20 text-green-400",
  },
  {
    name: "Claude 3",
    provider: "Anthropic",
    icon: "auto_awesome",
    colorClass: "bg-purple-500/20 text-purple-400",
  },
  {
    name: "Midjourney",
    provider: "Midjourney",
    icon: "palette",
    colorClass: "bg-cyan-500/20 text-cyan-400",
  },
  {
    name: "Llama 3",
    provider: "Meta",
    icon: "terminal",
    colorClass: "bg-orange-500/20 text-orange-400",
  },
  {
    name: "DALL-E",
    provider: "OpenAI",
    icon: "image",
    colorClass: "bg-pink-500/20 text-pink-400",
  },
];

export default function QuickAccessModels() {
  return (
    <div
      className="glass-panel rounded-2xl p-6 mb-12 animate-slideDown"
      style={{ animationDelay: "0.1s", animationFillMode: "both" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-cyan-400">bolt</span>
          Quick Access Models
        </h3>
        <a className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer">
          Manage Models
        </a>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 dropdown-scroll">
        {MODELS.map((model) => (
          <div
            key={model.name}
            className="flex h-12 min-w-[140px] cursor-pointer hover:bg-white/5 transition-colors items-center gap-x-3 rounded-xl bg-white/5 border border-white/5 pl-3 pr-5 group"
          >
            <div
              className={`size-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${model.colorClass}`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {model.icon}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-white text-sm font-bold">{model.name}</span>
              <span className="text-slate-400 text-[10px] uppercase tracking-wider">
                {model.provider}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
