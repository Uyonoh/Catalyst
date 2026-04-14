"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RawIntentPanel from "../components/studio/RawIntentPanel";
import LiveAnalysisPanel from "../components/studio/LiveAnalysisPanel";
import OptimizationSettings from "../components/studio/OptimizationSettings";
import { WorkspaceProvider, useWorkspace } from "../context/WorkspaceContext";
import { useUser } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import PromptEditor from "../components/studio/PromptEditor";
import Notification, { NotificationType } from "../components/Notification";
import { Eye, EyeOff } from "lucide-react";

export default function StudioPageContent() {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleToggle = () => {
    setIsTransitioning(true);
    setShowAnalysis((prev) => !prev);
  };

  return (
    <WorkspaceProvider>
      <StudioContent
        showAnalysis={showAnalysis}
        handleToggle={handleToggle}
        isTransitioning={isTransitioning}
        setIsTransitioning={setIsTransitioning}
      />
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
  const { parsedPrompt, input, selectedModel } = useWorkspace();
  const [showEditor, setShowEditor] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
  } | null>(null);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (parsedPrompt) {
      setShowEditor(true);
    }
  }, [parsedPrompt]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
      </div>

      {showEditor && parsedPrompt ? (
        <PromptEditor
          title="Newly Generated Prompt"
          initialEditedText={parsedPrompt}
          initialRawIntent={input}
          isAuthor={true}
          isPublic={isPublic}
          selectedModelId={selectedModel}
          isLoading={isSaving}
          onDiscard={() => {
            if (window.history.length > 1) {
              router.back();
            } else {
              router.push("/library");
            }
          }}
          onVisibilityChange={(val) => {
            setIsPublic(val);
            setNotification({
              message: `Visibility set to ${val ? "Public" : "Private"}`,
              type: "info",
            });
          }}
          onSave={async (title, text, categorySlug, tags) => {
            if (!user) {
              router.push("/login?redirect=/studio");
              return;
            }
            try {
              setIsSaving(true);
              const { error } = await supabase.from("prompts").insert({
                user_id: user.id,
                title: title || "Untitled Generated Prompt",
                content: text,
                snippet:
                  text.substring(0, 150) + (text.length > 150 ? "..." : ""),
                raw_input: input,
                target_model: selectedModel,
                is_public: isPublic,
                icon: categorySlug,
                tag: tags,
              });
              if (error) {
                console.error("Failed to save prompt", error);
                setNotification({
                  message: "Failed to save prompt",
                  type: "error",
                });
              } else {
                setShowEditor(false);
                router.push("/history");
              }
            } catch (err) {
              console.error("Error saving prompt", err);
              setNotification({ message: "An error occurred", type: "error" });
            } finally {
              setIsSaving(false);
            }
          }}
        />
      ) : (
        <main className="flex-1 w-full max-w-[1100px] mx-auto pt-16 pb-12 px-4 sm:px-6 flex flex-col gap-6 md:gap-8 animate-in fade-in duration-300">
          <section className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                Prompt Studio
              </h1>
              <p className="text-slate-400 text-base md:text-lg">
                Transform your raw ideas into optimized, targeted prompts.
              </p>
            </div>

            <button
              id="toggle-analysis-panel"
              onClick={handleToggle}
              aria-label={
                showAnalysis ? "Hide analysis panel" : "Show analysis panel"
              }
              aria-pressed={showAnalysis}
              title={showAnalysis ? "Hide Analysis" : "Show Analysis"}
              className={`
                flex-shrink-0 flex items-center gap-2
                px-3 py-2 sm:px-4 sm:py-2.5
                rounded-xl border text-sm font-medium
                transition-all duration-250
                active:scale-95 hover:-translate-y-0.5
                ${
                  showAnalysis
                    ? "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                    : "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 shadow-[0_0_16px_rgba(6,182,212,0.15)]"
                }
              `}
            >
              {showAnalysis ? (
                <Eye className="size-5 transition-transform duration-300" />
              ) : (
                <EyeOff className="size-5 transition-transform duration-300 scale-90" />
              )}
              <span className="hidden sm:inline whitespace-nowrap">
                {showAnalysis ? "Hide Analysis" : "Show Analysis"}
              </span>
            </button>
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
      )}

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
