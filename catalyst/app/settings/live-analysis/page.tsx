import SettingsSectionHeader from "../../components/settings/SettingsSectionHeader";
import AnalysisPreferencesForm from "../../components/settings/live-analysis/AnalysisPreferencesForm";
import { createClient } from "../../lib/supabase-server";
import { redirect } from "next/navigation";

export default async function LiveAnalysisSettings() {
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
        title="Live Analysis" 
        description="Configure how the Catalyst Studio engine analyzes your prompts in real-time."
      />
      
      <div className="flex flex-col gap-10 animate-fadeIn">
        <section>
          <AnalysisPreferencesForm user={user} preferences={profile?.preferences || {}} />
        </section>
      </div>
    </>
  );
}

