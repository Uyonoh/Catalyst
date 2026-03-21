"use client";

const PROMPTS = [
  {
    id: 1,
    title: "Code Refactor Agent",
    description: "System prompt designed to analyze legacy Python codebases and suggest modular improvements using SOLID principles.",
    tags: ["Python", "Engineering"],
    status: "Optimized",
    timeAgo: "2h ago",
    model: "GPT-4 Turbo",
    icon: "smart_toy",
    color: "green",
  },
  {
    id: 2,
    title: "SaaS Landing Copy",
    description: "Generating high-conversion hero section copy for a fintech startup targeting Gen Z users.",
    tags: ["Marketing", "Copywriting"],
    status: "Draft",
    timeAgo: "5h ago",
    model: "Claude 3 Opus",
    icon: "psychology",
    color: "yellow",
  },
  {
    id: 3,
    title: "Data Extraction JSON",
    description: "Reliably extract specific entities from unstructured medical text into a strict JSON schema.",
    tags: ["Data", "JSON"],
    status: "Testing",
    timeAgo: "1d ago",
    model: "Mistral Large",
    icon: "cloud",
    color: "purple",
  },
  {
    id: 4,
    title: "Legal Contract Summary",
    description: "Summarizing NDA documents highlighting key risk clauses and indemnity terms.",
    tags: ["Legal"],
    status: "Optimized",
    timeAgo: "2d ago",
    model: "Gemini 1.5 Pro",
    icon: "spark",
    color: "green",
  },
];

const MappedColors = {
  green: "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]",
  yellow: "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]",
  purple: "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]",
};

const MappedTextColors = {
  green: "text-green-400",
  yellow: "text-yellow-400",
  purple: "text-purple-400",
};

export default function RecentPrompts() {
  return (
    <section className="animate-slideDown" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-white tracking-tight">
          Recent Prompts
        </h2>
        <div className="flex gap-2">
          <button className="size-8 flex items-center justify-center rounded-lg glass-panel hover:bg-white/10 text-white transition-colors cursor-pointer">
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
              grid_view
            </span>
          </button>
          <button className="size-8 flex items-center justify-center rounded-lg bg-transparent hover:bg-white/5 text-slate-500 hover:text-white transition-colors cursor-pointer">
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
              list
            </span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROMPTS.map((prompt) => (
          <div
            key={prompt.id}
            className="glass-panel rounded-2xl p-5 hover:border-cyan-500/30 transition-all duration-300 group hover:-translate-y-1 cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-slate-400 hover:text-white">
                more_horiz
              </span>
            </div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className={`size-2 rounded-full ${MappedColors[prompt.color as keyof typeof MappedColors]}`}
                ></div>
                <span
                  className={`text-xs font-mono ${MappedTextColors[prompt.color as keyof typeof MappedTextColors]}`}
                >
                  {prompt.status}
                </span>
              </div>
              <span className="text-xs text-slate-500">{prompt.timeAgo}</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
              {prompt.title}
            </h3>
            <p className="text-slate-400 text-sm mb-4 line-clamp-2">
              {prompt.description}
            </p>
            <div className="flex items-center gap-2 mb-4">
              {prompt.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 rounded bg-white/5 text-[10px] text-slate-300 border border-white/5"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-slate-500"
                  style={{ fontSize: "16px" }}
                >
                  {prompt.icon}
                </span>
                <span className="text-xs text-slate-400">{prompt.model}</span>
              </div>
              <div className="flex items-center gap-1 text-[--color-primary] text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                Open{" "}
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "14px" }}
                >
                  arrow_forward
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Placeholder */}
        <div className="border border-dashed border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center hover:bg-white/5 transition-colors cursor-pointer min-h-[220px]">
          <div className="size-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-slate-500">add</span>
          </div>
          <span className="text-slate-500 text-sm font-medium">
            Create New Prompt
          </span>
        </div>
      </div>
    </section>
  );
}
