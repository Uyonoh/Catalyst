import GlassPanel from '../../workspace/components/GlassPanel';

export interface VaultItem {
  id: number;
  title: string;
  updated: string;
  snippet: string;
  model: string;
  modelColor: string;
  tag: string;
  icon: string;
  iconColor: string;
  hasGradient: boolean;
}

interface VaultCardProps {
  item: VaultItem;
}

export default function VaultCard({ item }: VaultCardProps) {
  return (
    <GlassPanel
      hoverable
      className="p-5 flex flex-col gap-4 group cursor-pointer relative overflow-hidden active:scale-[0.98] transition-all h-full"
    >
      {item.hasGradient && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-bl-full -mr-4 -mt-4 transition-opacity opacity-50 group-hover:opacity-100" />
      )}
      <div className="flex justify-between items-start z-10">
        <div className="flex items-center gap-3">
          <div
            className={`size-10 rounded-lg bg-${item.iconColor}-500/10 flex items-center justify-center text-${item.iconColor}-400 border border-${item.iconColor}-500/20`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
          </div>
          <div>
            <h3 className="text-white font-bold leading-tight group-hover:text-cyan-400 transition-colors">
              {item.title}
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">Updated {item.updated}</p>
          </div>
        </div>
        <button className="text-slate-500 hover:text-cyan-400 transition-colors" aria-label="More options">
          <span className="material-symbols-outlined text-[20px]">more_vert</span>
        </button>
      </div>
      <div className="h-[1px] w-full bg-white/5" />
      <p className="text-slate-300 text-sm leading-relaxed line-clamp-3 font-mono opacity-80 code-preview p-2 rounded border border-white/10">
        {item.snippet}
      </p>
      <div className="mt-auto pt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded bg-${item.modelColor}-500/10 border border-${item.modelColor}-500/20 text-[10px] font-semibold text-${item.modelColor}-400 uppercase tracking-wide`}
          >
            {item.model}
          </span>
          <span className="text-slate-500 text-xs font-medium">{item.tag}</span>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-cyan-400 transition-colors"
            title="Copy"
          >
            <span className="material-symbols-outlined text-[18px]">content_copy</span>
          </button>
          <button
            className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-cyan-400 transition-colors"
            title="Edit"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
        </div>
      </div>
    </GlassPanel>
  );
}
