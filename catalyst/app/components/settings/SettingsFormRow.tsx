interface SettingsFormRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

export default function SettingsFormRow({ label, description, children }: SettingsFormRowProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-white/5 last:border-0 gap-4">
      <div className="flex flex-col gap-1 max-w-md">
        <label className="text-sm font-semibold text-white">
          {label}
        </label>
        {description && (
          <p className="text-xs text-slate-500 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="shrink-0 w-full md:w-auto min-w-[240px]">
        {children}
      </div>
    </div>
  );
}
