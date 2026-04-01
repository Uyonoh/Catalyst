import SettingsSectionHeader from "../../components/settings/SettingsSectionHeader";

export default function NotificationsSettings() {
  return (
    <>
      <SettingsSectionHeader 
        title="Notifications" 
        description="Stay updated on batch prompt status and important Catalyst product alerts."
      />
      <div className="flex flex-col gap-6 animate-fadeIn">
        <p className="text-slate-400">Notification preferences coming in Chunk 8.</p>
      </div>
    </>
  );
}
