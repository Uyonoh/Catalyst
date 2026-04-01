import SettingsSectionHeader from "../../components/settings/SettingsSectionHeader";
import PrivacySettingsForm from "../../components/settings/privacy/PrivacySettingsForm";
import DataExportPanel from "../../components/settings/privacy/DataExportPanel";
import { createClient } from "../../lib/supabase-server";
import { redirect } from "next/navigation";

export default async function PrivacySettings() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("preferences")
    .eq("id", user.id)
    .single();

  return (
    <>
      <SettingsSectionHeader 
        title="Privacy & Data Control" 
        description="Manage your data usage, visibility preferences, and account security defaults."
      />
      
      <div className="flex flex-col gap-8 animate-fadeIn">
        <section>
          <PrivacySettingsForm user={user} preferences={profile?.preferences || {}} />
        </section>

        <section>
          <DataExportPanel />
        </section>
      </div>
    </>
  );
}

