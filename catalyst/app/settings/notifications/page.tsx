import SettingsSectionHeader from "../../components/settings/SettingsSectionHeader";
import NotificationSettingsForm from "../../components/settings/notifications/NotificationSettingsForm";
import { createClient } from "../../lib/supabase-server";
import { redirect } from "next/navigation";

export default async function NotificationsSettings() {
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
        title="Notification Preferences" 
        description="Stay updated on batch prompt status, security alerts, and important Catalyst product updates."
      />
      
      <div className="flex flex-col gap-10 animate-fadeIn">
        <section>
          <NotificationSettingsForm user={user} preferences={profile?.preferences || {}} />
        </section>
      </div>
    </>
  );
}

