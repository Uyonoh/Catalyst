import SettingsSectionHeader from "../../components/settings/SettingsSectionHeader";
import ProfileForm from "../../components/settings/general/ProfileForm";
import AccountSecurityForm from "../../components/settings/general/AccountSecurityForm";
import DangerZone from "../../components/settings/general/DangerZone";
import { createClient } from "../../lib/supabase-server";
import { redirect } from "next/navigation";

export default async function GeneralSettings() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch the current profile for the user
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <>
      <SettingsSectionHeader 
        title="General Profile" 
        description="Update your personal details and personal preferences."
      />
      
      <div className="flex flex-col gap-10 animate-fadeIn">
        <section>
          <ProfileForm user={user} profile={profile || {}} />
        </section>

        <div className="h-px bg-white/10 w-full" />

        <section>
          <AccountSecurityForm user={user} />
        </section>

        <section>
          <DangerZone />
        </section>
      </div>
    </>
  );
}

