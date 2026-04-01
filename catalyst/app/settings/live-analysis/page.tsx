import SettingsSectionHeader from "../../components/settings/SettingsSectionHeader";

export default function LiveAnalysisSettings() {
  return (
    <>
      <SettingsSectionHeader 
        title="Live Analysis" 
        description="Configure how the Catalyst Studio engine analyzes your prompts in real-time."
      />
      <div className="flex flex-col gap-6 animate-fadeIn">
        <p className="text-slate-400">Analysis preferences coming in Chunk 6.</p>
      </div>
    </>
  );
}
