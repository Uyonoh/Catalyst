"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import PromptEditor from "../../components/studio/PromptEditor";
import Notification, { NotificationType } from "../../components/Notification";

interface PromptEditorViewProps {
  id: string;
  initialData: {
    title: string;
    content: string;
    raw_input: string;
    target_model: string;
    user_id?: string;
    is_public: boolean;
    icon?: string;
  };
}


export default function PromptEditorView({
  id,
  initialData,
  currentUserId,
}: PromptEditorViewProps & { currentUserId?: string }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isPublic, setIsPublic] = useState(initialData.is_public);
  const [notification, setNotification] = useState<{ message: string; type: NotificationType } | null>(null);
  
  const isAuthor = !!currentUserId && currentUserId === initialData.user_id;

  const handleSave = async (text: string, categorySlug: string) => {
    try {
      setIsSaving(true);
      
      if (isAuthor) {
        // Update existing prompt
        const { error } = await supabase
          .from("prompts")
          .update({
            content: text,
            snippet: text.substring(0, 150) + (text.length > 150 ? "..." : ""),
            icon: categorySlug,
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
            is_public: isPublic, // Preserve the chosen visibility for copies
            icon: categorySlug,
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

  const handleVisibilityChange = async (newVisibility: boolean) => {
    // Only author can change visibility on the actual record
    if (!isAuthor) {
      setIsPublic(newVisibility);
      setNotification({
        message: `Visibility set to ${newVisibility ? "Public" : "Private"} (will be saved when you save your copy)`,
        type: "info"
      });
      return;
    }

    try {
      setIsSaving(true);
      const { error } = await supabase
        .from("prompts")
        .update({ is_public: newVisibility })
        .eq("id", id);

      if (error) {
        setNotification({ message: "Failed to update visibility", type: "error" });
        console.error("Error updating visibility:", error);
      } else {
        setIsPublic(newVisibility);
        setNotification({ 
          message: `Prompt is now ${newVisibility ? "Public" : "Private"}`, 
          type: "success" 
        });
      }
    } catch (err) {
      setNotification({ message: "An error occurred", type: "error" });
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="flex-1 w-full max-w-[1000px] mx-auto pt-16 pb-12 px-4 sm:px-6 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PromptEditor
        title={initialData.title || "Untitled"}
        initialEditedText={initialData.content || ""}
        initialRawIntent={initialData.raw_input || "No raw intent available"}
        isAuthor={isAuthor}
        isPublic={isPublic}
        selectedModelId={initialData.target_model}
        initialCategory={initialData.icon}
        onDiscard={handleDiscard}
        onSave={handleSave}
        onVisibilityChange={handleVisibilityChange}
        isLoading={isSaving}
        className="pt-0 pb-0 px-0 sm:px-0"
      />

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </main>
  );
}

