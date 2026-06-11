import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { createClient, getServerUser } from "../../lib/supabase-server";
import PromptEditorView from "./PromptEditorView";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getPrompt(id: string, isPrivate: boolean, hasUser: boolean) {
  try {
    const supabaseClient = await createClient();
    
    // If explicitly querying private or if user logged in (might be the author)
    if (isPrivate || hasUser) {
      const { data, error } = await supabaseClient
        .from("prompts")
        .select("*")
        .eq("id", id)
        .single();
        
      if (!error && data) {
        return data;
      }
      
      // If we failed to fetch the prompt, and we were explicitly asking for private,
      // then we should not fall back to public. The user simply doesn't have access.
      if (isPrivate) {
        console.error("Failed to fetch private prompt:", error);
        return null;
      }
    }

    // Fallback for unauthenticated viewers or if the logged-in user isn't the author
    const { data, error } = await supabaseClient
      .from("prompts_public")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Failed to fetch prompt:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error fetching prompt:", err);
    return null;
  }
}

export default async function PromptViewEditPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const id = resolvedParams.id;
  const isPrivate = resolvedSearchParams.private === "true";
  
  const user = await getServerUser();
  const promptData = await getPrompt(id, isPrivate, !!user);

  if (!promptData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">
              Prompt not found
            </h1>
            <p className="text-slate-400">
              The prompt you're looking for doesn't exist or you don't have
              access.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const initialData = {
    title: promptData.title || "Untitled",
    content: promptData.content || promptData.snippet || "",
    raw_input: promptData.raw_input || "No raw intent available",
    target_model: promptData.target_model || "",
    user_id: promptData.user_id,
    is_public: promptData.is_public ?? (isPrivate ? false : true),
    icon: promptData.icon,
    tag: promptData.tag || "",
    format: promptData.format || "text",
    workspace_id: promptData.workspace_id,
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <Header />
        <PromptEditorView id={id} initialData={initialData} currentUserId={user?.id} />
        <Footer />
      </div>
    </>
  );
}

