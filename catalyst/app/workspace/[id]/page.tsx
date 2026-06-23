import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { createClient, getServerUser } from "../../lib/supabase-server";
import { redirect } from "next/navigation";
import WorkspaceClientView from "./WorkspaceClientView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WorkspacePage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const user = await getServerUser();
  const supabase = await createClient();

  // Fetch workspace details and creator profile
  const { data: workspace, error: wError } = await supabase
    .from("workspaces")
    .select(
      `
      id,
      name,
      description,
      visibility,
      user_id,
      created_at,
      user_metadata (
        name
      )
    `,
    )
    .eq("id", id)
    .single();

  if (wError || !workspace) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center relative z-10 px-4">
          <div className="text-center p-8 rounded-2xl glass-panel border border-white/5 max-w-md">
            <h1 className="text-2xl font-bold text-white mb-2">
              Workspace not found
            </h1>
            <p className="text-slate-400 text-sm mb-6">
              The workspace you are trying to access doesn't exist, is private,
              or you do not have permission to view it.
            </p>
            <a
              href="/dashboard"
              className="inline-flex px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-sm rounded-xl hover:shadow-lg transition-all"
            >
              Back to Dashboard
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Fetch prompts associated with this workspace
  const { data: prompts = [] } = await supabase
    .from("prompts")
    .select(
      `
      id,
      title,
      content,
      snippet,
      target_model,
      tag,
      icon,
      created_at,
      user_id,
      is_favorite,
      user_metadata (
        name
      )
    `,
    )
    .eq("workspace_id", id)
    .order("created_at", { ascending: false });

  // Map workspace and prompt data
  const wProfile: any = Array.isArray(workspace.user_metadata)
    ? workspace.user_metadata[0]
    : workspace.user_metadata;

  const workspaceData = {
    id: workspace.id,
    name: workspace.name,
    description: workspace.description,
    visibility: workspace.visibility || "private",
    user_id: workspace.user_id,
    created_at: workspace.created_at,
    creatorName: wProfile?.name || "Architect",
  };

  const promptsList = (prompts || []).map((p: any) => {
    const pProfile: any = Array.isArray(p.user_metadata)
      ? p.user_metadata[0]
      : p.user_metadata;

    return {
      id: p.id,
      title: p.title || "Untitled Prompt",
      content: p.content,
      snippet: p.snippet || p.content.substring(0, 150),
      target_model: p.target_model,
      tag: p.tag,
      icon: p.icon || "chat",
      created_at: p.created_at,
      user_id: p.user_id,
      is_favorite: p.is_favorite || false,
      authorName: pProfile?.name || "Anonymous",
    };
  });

  return (
    <>
      {/* Ambient Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#258cf4]/10 blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none z-0"></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <Header />
        <WorkspaceClientView
          workspace={workspaceData}
          initialPrompts={promptsList}
          currentUserId={user?.id}
        />
        <Footer />
      </div>
    </>
  );
}
