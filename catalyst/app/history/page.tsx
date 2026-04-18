
import Header from "../components/Header";
import Footer from "../components/Footer";
import { History, TrendingUp, Sparkles, BrainCircuit } from "lucide-react";
import { getServerUser, createClient } from "../lib/supabase-server";
import { redirect } from "next/navigation";
import HistoryList from "../components/history/HistoryList";
import GlassPanel from "../components/GlassPanel";


async function getHistoryItems(userId: string, searchParams: {
  q?: string;
  tags?: string;
  icons?: string;
  models?: string;
  modes?: string;
  sort?: string;
}) {
  const supabase = await createClient();
  let query = supabase
    .from("prompts")
    .select("id, title, content, snippet, raw_input, target_model, created_at, updated_at, is_public, icon, tag")
    .eq("user_id", userId);

  // Search
  if (searchParams.q) {
    query = query.or(
      `title.ilike.%${searchParams.q}%,content.ilike.%${searchParams.q}%,raw_input.ilike.%${searchParams.q}%`
    );
  }

  // Tags
  if (searchParams.tags) {
    const tagsArray = searchParams.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (tagsArray.length > 0) {
      query = query.in("tag", tagsArray);
    }
  }

  // Icons / Categories
  if (searchParams.icons) {
    const iconsArray = searchParams.icons
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);
    if (iconsArray.length > 0) {
      query = query.in("icon", iconsArray);
    }
  }

  // Models
  if (searchParams.models) {
    const modelsArray = searchParams.models
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);
    if (modelsArray.length > 0) {
      query = query.in("target_model", modelsArray);
    }
  }

  // Sorting
  const sort = searchParams.sort || "newest";
  if (sort === "oldest") {
    query = query.order("created_at", { ascending: true });
  } else if (sort === "title") {
    query = query.order("title", { ascending: true });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch history:", error.message);
    return [];
  }

  let filteredData = data || [];
  
  // Modality filtering
  if (searchParams.modes) {
    const modesArray = searchParams.modes
      .split(",")
      .map((m) => m.trim().toLowerCase());
    
    filteredData = filteredData.filter((item: any) => {
      const model = (item.target_model || "").toLowerCase();
      if (
        modesArray.includes("image") &&
        (model.includes("midjourney") ||
          model.includes("dall-e") ||
          model.includes("stable diffusion"))
      )
        return true;
      if (
        modesArray.includes("video") &&
        (model.includes("veo") || model.includes("sora"))
      )
        return true;
      if (
        modesArray.includes("text") &&
        !(
          model.includes("midjourney") ||
          model.includes("dall-e") ||
          model.includes("stable diffusion") ||
          model.includes("veo") ||
          model.includes("sora")
        )
      )
        return true;
      return false;
    });
  }

  return filteredData;
}

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await getServerUser();

  if (!user) {
    redirect("/login?redirect=/history");
  }

  const resolvedSearchParams = await searchParams;
  const params = {
    q: typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : undefined,
    tags: typeof resolvedSearchParams.tags === "string" ? resolvedSearchParams.tags : undefined,
    icons: typeof resolvedSearchParams.icons === "string" ? resolvedSearchParams.icons : undefined,
    models: typeof resolvedSearchParams.models === "string" ? resolvedSearchParams.models : undefined,
    modes: typeof resolvedSearchParams.modes === "string" ? resolvedSearchParams.modes : undefined,
    sort: typeof resolvedSearchParams.sort === "string" ? resolvedSearchParams.sort : undefined,
  };

  const items = await getHistoryItems(user.id, params);

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-primary/15 rounded-full blur-[140px] animate-pulse duration-5000" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 w-full max-w-[1240px] mx-auto pt-24 pb-20 px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-fadeIn">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full w-fit">
                <Sparkles className="size-4 text-cyan-400" />
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-300">Your Journey</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight">
                Prompt <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500">History</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                Revisit and manage all your previous prompt optimizations. Track your refinement history and reuse your best creations.
              </p>
            </div>
            
            {/* Quick stats for premium feel */}
            <div className="grid grid-cols-2 gap-3 self-start md:self-auto">
              <GlassPanel className="p-4 flex flex-col gap-1 min-w-[120px] bg-white/5 border-white/10">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Total Prompts</span>
                <div className="flex items-center gap-2">
                  <History className="size-4 text-cyan-400" />
                  <span className="text-2xl font-black text-white">{items.length}</span>
                </div>
              </GlassPanel>
              <GlassPanel className="p-4 flex flex-col gap-1 min-w-[120px] bg-white/5 border-white/10">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Top Model</span>
                <div className="flex items-center gap-2">
                  <BrainCircuit className="size-4 text-emerald-400" />
                  <span className="text-sm font-black text-white truncate max-w-[80px]">
                    {items.length > 0 ? (items[0].target_model || "N/A") : "None"}
                  </span>
                </div>
              </GlassPanel>
            </div>
          </div>
          
          <HistoryList initialItems={items} />
        </main>
        
        <Footer />
      </div>
    </>
  );
}

