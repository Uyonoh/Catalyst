import SettingsSectionHeader from "../../components/settings/SettingsSectionHeader";

export default function SubscriptionsSettings() {
  return (
    <>
      <SettingsSectionHeader 
        title="Subscription Plan" 
        description="Monitor your token usage and manage your Catalyst Studio subscription."
      />
      <div className="flex flex-col gap-6 animate-fadeIn">
        <p className="text-slate-400">Subscription management stub coming in Chunk 5.</p>
      </div>
    </>
  );
}
