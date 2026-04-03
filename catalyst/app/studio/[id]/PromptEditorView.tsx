"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import PromptEditor from "../../components/studio/PromptEditor";

interface PromptEditorViewProps {
  id: string;
  initialData: {
    title: string;
    content: string;
    raw_input: string;
    target_model: string;
    user_id?: string;
  };
}


export default function PromptEditorView({
  id,
  initialData,
  currentUserId,
}: PromptEditorViewProps & { currentUserId?: string }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const isAuthor = !!currentUserId && currentUserId === initialData.user_id;

  const handleSave = async (text: string) => {
    try {
      setIsSaving(true);
      
      if (isAuthor) {
        // Update existing prompt
        const { error } = await supabase
          .from("prompts")
          .update({
            content: text,
            snippet: text.substring(0, 150) + (text.length > 150 ? "..." : ""),
          })
          .eq("id", id);

        if (error) {
          console.error("Failed to update prompt:", error);
        }
      } else {
        // Create a new prompt (copy) for the current user
        const { error } = await supabase
          .from("prompts")
          .insert({
            title: initialData.title,
            content: text,
            snippet: text.substring(0, 150) + (text.length > 150 ? "..." : ""),
            raw_input: initialData.raw_input,
            target_model: initialData.target_model,
            user_id: currentUserId,
            is_public: false, // Default to private for copies
          });

        if (error) {
          console.error("Failed to create new prompt copy:", error);
        }
      }
    } catch (err) {
      console.error("Error saving prompt:", err);
    } finally {
      setIsSaving(false);
      router.push("/library");
    }
  };

  const handleDiscard = () => {
    router.back();
  };

  return (
    <main className="flex-1 w-full max-w-[1000px] mx-auto pt-16 pb-12 px-4 sm:px-6 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PromptEditor
        title={initialData.title || "Untitled"}
        initialEditedText={initialData.content || ""}
        initialRawIntent={initialData.raw_input || "No raw intent available"}
        isAuthor={isAuthor}
        selectedModelId={initialData.target_model}
        onDiscard={handleDiscard}
        onSave={handleSave}
        isLoading={isSaving}
        className="pt-0 pb-0 px-0 sm:px-0"
      />
    </main>
  );
}

