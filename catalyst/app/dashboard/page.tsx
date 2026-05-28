import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSection from "../components/home/HeroSection";
import QuickAccessModels from "../components/home/QuickAccessModels";
import StatsOverview from "../components/home/StatsOverview";
import RecentPrompts from "../components/home/RecentPrompts";
import TokenAnalyticsCard from "../components/home/TokenAnalyticsCard";
import InteractiveActionHub from "../components/home/InteractiveActionHub";
import WorkspacesOverview from "../components/home/WorkspacesOverview";
import { getRecentPrompts } from "../lib/prompts";
import { getServerUser, createClient } from "../lib/supabase-server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getServerUser();
  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  const supabase = await createClient();

  // Fetch all counts, lists, logs and profile plan in parallel to maximize performance and security
  const [
    recentPrompts,
    profileRes,
    promptsCountRes,
    workspacesCountRes,
    favoritesCountRes,
    analysesCountRes,
    workspacesListRes,
    usageLogsRes,
    weeklyLogsRes
  ] = await Promise.all([
    getRecentPrompts(user.id),
    supabase.from("profiles").select("plan, daily_tokens_used, tokens_reset_at, full_name").eq("id", user.id).single(),
    supabase.from("prompts").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("workspaces").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("prompts").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("is_favorite", true),
    supabase.from("prompt_analyses").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("workspaces").select("id, name, description, created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("token_usage_log").select("id, model_slug, mode, cost, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(6),
    supabase.from("token_usage_log").select("cost, created_at").eq("user_id", user.id).gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
  ]);

  // Handle profile response
  const profile = profileRes.data || {
    plan: "free",
    daily_tokens_used: 0,
    full_name: null,
  };

  // Compile count metrics
  const promptsCount = promptsCountRes.count || 0;
  const workspacesCount = workspacesCountRes.count || 0;
  const favoritesCount = favoritesCountRes.count || 0;
  const analysesCount = analysesCountRes.count || 0;

  // Compile list data
  const workspacesList = (workspacesListRes.data || []).map((w: any) => ({
    id: w.id,
    name: w.name,
    description: w.description,
    created_at: w.created_at,
  }));

  const recentLogs = (usageLogsRes.data || []).map((log: any) => ({
    id: log.id,
    model_slug: log.model_slug,
    mode: log.mode,
    cost: log.cost,
    created_at: log.created_at,
  }));

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

  // Dynamically resolve full name or split email
  const displayUserName = profile.full_name || user.email?.split("@")[0] || "Architect";

  return (
    <>
      <Header />

      {/* Ambient Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#258cf4]/10 blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none z-0"></div>

      {/* Main Content Area - Grid Layout Cockpit */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto pt-24 pb-12 px-4 md:px-8 relative z-10">
        
        {/* Welcome Section */}
        <HeroSection userName={displayUserName} />
        
        {/* Real-time Dynamic Stats Cards */}
        <StatsOverview 
          promptsCount={promptsCount} 
          workspacesCount={workspacesCount} 
          analysesCount={analysesCount} 
          favoritesCount={favoritesCount} 
        />

        {/* 2-Column Responsive Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Workspaces, Sandboxing, & Saved Prompts Library (Takes 8/12 cols) */}
          <div className="lg:col-span-8 flex flex-col">
            {/* Quick Action Sandbox area */}
            <InteractiveActionHub />
            
            {/* Workspaces & Folders creator widget */}
            <WorkspacesOverview 
              initialWorkspaces={workspacesList} 
              promptsCount={promptsCount} 
            />
            
            {/* Searchable Recent Prompts Grid */}
            <RecentPrompts prompts={recentPrompts} />
          </div>

          {/* Right Column: Quota Analytics & Models Catalog (Takes 4/12 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Real-time resource Quota ring, weekly trend bar chart & usage logs ledger */}
            <TokenAnalyticsCard 
              plan={profile.plan as any} 
              dailyTokensUsed={profile.daily_tokens_used} 
              recentLogs={recentLogs} 
              weeklyChartData={weeklyChartData}
            />

            {/* Models list */}
            <QuickAccessModels />
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
