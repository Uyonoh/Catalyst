"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RawIntentPanel from "../components/studio/RawIntentPanel";
import LiveAnalysisPanel from "../components/studio/LiveAnalysisPanel";
import OptimizationSettings from "../components/studio/OptimizationSettings";
import { WorkspaceProvider, useWorkspace } from "../context/WorkspaceContext";
import { useUser } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import PromptEditor from "../components/studio/PromptEditor";
import Notification, { NotificationType } from "../components/Notification";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function StudioPageContent() {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleToggle = () => {
    setIsTransitioning(true);
    setShowAnalysis((prev) => !prev);
  };

  return (
    <WorkspaceProvider>
      <Suspense fallback={
        <div className="flex-grow flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-cyan-400" />
        </div>
      }>
        <StudioContent
          showAnalysis={showAnalysis}
          handleToggle={handleToggle}
          isTransitioning={isTransitioning}
          setIsTransitioning={setIsTransitioning}
        />
      </Suspense>
    </WorkspaceProvider>
  );
}

function StudioContent({
  showAnalysis,
  handleToggle,
  isTransitioning,
  setIsTransitioning,
}: {
  showAnalysis: boolean;
  handleToggle: () => void;
  isTransitioning: boolean;
  setIsTransitioning: (v: boolean) => void;
}) {
  const { parsedPrompt, parsedFormat, input, selectedModel } = useWorkspace();
  const [showEditor, setShowEditor] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
  } | null>(null);
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspace") || null;

  useEffect(() => {
    const autoSave = async () => {
      if (parsedPrompt && user && !isSaving) {
        try {
          setIsSaving(true);
          const { data, error } = await supabase
            .from("prompts")
            .insert({
              user_id: user.id,
              workspace_id: workspaceId,
              title: "Untitled Generated Prompt",
              content: parsedPrompt,
              snippet:
                parsedPrompt.substring(0, 150) +
                (parsedPrompt.length > 150 ? "..." : ""),
              raw_input: input,
              target_model: selectedModel,
              is_public: isPublic,
              icon: "chat", // Default category
              tag: "",
              format: parsedFormat || "text",
            })
            .select()
            .single();

          if (error) {
            console.error("Failed to auto-save prompt", error);
            setNotification({
              message: "Failed to auto-save prompt",
              type: "error",
            });
          } else if (data) {
            setNotification({
              message: "Prompt generated and saved automatically",
              type: "success",
            });
            // Redirect to the edit page for the newly saved prompt
            router.push(`/studio/${data.id}`);
          }
        } catch (err) {
          console.error("Error auto-saving prompt", err);
          setNotification({
            message: "An error occurred while saving",
            type: "error",
          });
        } finally {
          setIsSaving(false);
        }
      }
    };

    if (parsedPrompt) {
      autoSave();
    }
  }, [parsedPrompt, parsedFormat, user, input, selectedModel, isPublic, router, workspaceId]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
      </div>

      <main className="flex-1 w-full max-w-[1100px] mx-auto pt-16 pb-12 px-4 sm:px-6 flex flex-col gap-6 md:gap-8 animate-in fade-in duration-300">
        <section className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              Prompt Studio
            </h1>
            <p className="text-slate-400 text-base md:text-lg">
              Refine your ideas into high-quality, purpose-driven prompts.
            </p>
          </div>
        </section>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0 w-full">
              <RawIntentPanel />
            </div>

            <div
              onTransitionEnd={(e) => {
                if (
                  e.propertyName === "max-width" ||
                  e.propertyName === "max-height"
                ) {
                  setIsTransitioning(false);
                }
              }}
              className={`
                analysis-panel-slot self-stretch lg:w-[50%] lg:flex-shrink-0 w-full h-full
                ${showAnalysis ? "" : "analysis-panel-slot--hidden"}
                ${!showAnalysis && !isTransitioning ? "hidden" : "block"}
              `}
              aria-hidden={!showAnalysis}
            >
              <div className="w-full h-full min-w-[320px] lg:min-w-[450px] xl:min-w-[600px]">
                <LiveAnalysisPanel />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-12 flex flex-col gap-4">
              <OptimizationSettings />
            </div>
          </div>
        </main>


      <div className="fixed bottom-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-900/50 to-transparent pointer-events-none" />

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  );
}
