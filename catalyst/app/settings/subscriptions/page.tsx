import SettingsSectionHeader from "../../components/settings/SettingsSectionHeader";
import SubscriptionPanel from "../../components/settings/subscriptions/SubscriptionPanel";
import { createClient } from "../../lib/supabase-server";
import { redirect } from "next/navigation";

export default async function SubscriptionsSettings() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch plan
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  // Fetch prompt count
  const { count: promptsCount } = await supabase
    .from("prompts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Fetch analysis count
  const { count: analysesCount } = await supabase
    .from("prompt_analyses")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  return (
    <>
      <SettingsSectionHeader 
        title="Subscription Plan" 
        description="Monitor your token usage and manage your Catalyst Studio subscription."
      />
      
      <div className="flex flex-col gap-10 animate-fadeIn">
        <section>
          <SubscriptionPanel 
            plan={profile?.plan || "free"} 
            promptsCount={promptsCount || 0} 
            analysesCount={analysesCount || 0}
          />
        </section>
      </div>
    </>
  );
}

