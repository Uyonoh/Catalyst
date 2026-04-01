import SettingsSectionHeader from "../../components/settings/SettingsSectionHeader";

export default function PrivacySettings() {
  return (
    <>
      <SettingsSectionHeader 
        title="Privacy & Security" 
        description="Manage your data usage, visibility preferences, and account security defaults."
      />
      <div className="flex flex-col gap-6 animate-fadeIn">
        <p className="text-slate-400">Privacy controls and data export coming in Chunk 7.</p>
      </div>
    </>
  );
}
