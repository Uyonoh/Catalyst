import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { createClient } from "../../lib/supabase-server";
import PromptEditorView from "./PromptEditorView";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getPrompt(id: string, isPrivate: boolean = false) {
  try {
    const supabaseClient = await createClient();
    const table = isPrivate ? "prompts" : "prompts_public";
    
    const { data, error } = await supabaseClient
      .from(table)
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
  
  const promptData = await getPrompt(id, isPrivate);

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
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <Header />
        <PromptEditorView id={id} initialData={initialData} />
        <Footer />
      </div>
    </>
  );
}
