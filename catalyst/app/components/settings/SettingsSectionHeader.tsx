interface SettingsSectionHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function SettingsSectionHeader({ title, description, action }: SettingsSectionHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="text-slate-400 text-sm max-w-xl">
          {description}
        </p>
      </div>
      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
