import SettingsSectionHeader from "../../components/settings/SettingsSectionHeader";
import PromptSettingsForm from "../../components/settings/prompt-settings/PromptSettingsForm";
import { createClient } from "../../lib/supabase-server";
import { redirect } from "next/navigation";

export default async function PromptSettings() {
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
        title="Prompt Controls" 
        description="Configure the default optimization controls applied initially in the Catalyst Studio."
      />
      
      <div className="flex flex-col gap-10 animate-fadeIn">
        <section>
          <PromptSettingsForm user={user} preferences={profile?.preferences || {}} />
        </section>
      </div>
    </>
  );
}

