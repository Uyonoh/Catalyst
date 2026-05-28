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

  // Fetch counts, list logs, and weekly logs in parallel
  const [
    promptsCountRes,
    analysesCountRes,
    workspacesCountRes,
    favoritesCountRes,
    usageLogsRes,
    weeklyLogsRes
  ] = await Promise.all([
    supabase.from("prompts").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("prompt_analyses").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("workspaces").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("prompts").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("is_favorite", true),
    supabase.from("token_usage_log").select("id, model_slug, mode, cost, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
    supabase.from("token_usage_log").select("cost, created_at").eq("user_id", user.id).gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
  ]);

  const promptsCount = promptsCountRes.count || 0;
  const analysesCount = analysesCountRes.count || 0;
  const workspacesCount = workspacesCountRes.count || 0;
  const favoritesCount = favoritesCountRes.count || 0;
  const recentLogs = usageLogsRes.data || [];

  // Compile last 7 days of token consumption costs grouped by day
  const weeklyChartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return {
      dateStr: d.toLocaleDateString("en-US", { weekday: "short" }),
      dateISO: d.toISOString().split("T")[0],
      cost: 0,
    };
  }).reverse();

  const weeklyLogs = weeklyLogsRes.data || [];
  weeklyLogs.forEach((log: any) => {
    const logDateStr = new Date(log.created_at).toISOString().split("T")[0];
    const match = weeklyChartData.find((day) => day.dateISO === logDateStr);
    if (match) {
      match.cost += log.cost;
    }
  });

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
            promptsCount={promptsCount} 
            analysesCount={analysesCount}
            workspacesCount={workspacesCount}
            favoritesCount={favoritesCount}
            recentLogs={recentLogs}
            weeklyChartData={weeklyChartData}
          />
        </section>
      </div>
    </>
  );
}

