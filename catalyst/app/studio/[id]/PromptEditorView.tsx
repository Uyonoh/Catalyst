"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import PromptEditor from "../../components/studio/PromptEditor";
import Notification, {
  NotificationType,
} from "../../components/history/Notification";
import { useUser } from "../../context/AuthContext";
import { Sparkles, X, ArrowRight } from "lucide-react";

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
    tag?: string;
    format?: string;
    workspace_id?: string | null;
    target?: {
      output_type?: string;
      output?: string;
      negative_prompt?: string;
      aspect_ratio?: string;
    };
  };
}

// Detect the best file format and extension from prompt content
function detectDownloadFormat(text: string): { ext: string; mime: string } {
  const trimmed = text.trim();
  // JSON detection
  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    try {
      JSON.parse(trimmed);
      return { ext: "json", mime: "application/json" };
    } catch {
      // not valid JSON, fall through
    }
  }
  // YAML detection (simple heuristic: has top-level key: value lines)
  if (/^[a-zA-Z_][\w-]*\s*:/m.test(trimmed) && !trimmed.startsWith("#!")) {
    const yamlLines = trimmed.split("\n");
    const keyValueLines = yamlLines.filter((l) =>
      /^\s*[a-zA-Z_][\w-]*\s*:/.test(l),
    );
    if (
      keyValueLines.length >= 2 &&
      keyValueLines.length >= yamlLines.length * 0.3
    ) {
      return { ext: "yaml", mime: "text/yaml" };
    }
  }
  // Markdown detection (has headings, bold, or code blocks)
  if (
    /^#{1,6}\s/m.test(trimmed) ||
    /\*\*[^*]+\*\*/.test(trimmed) ||
    /```/.test(trimmed)
  ) {
    return { ext: "md", mime: "text/markdown" };
  }
  // Default: plain text
  return { ext: "txt", mime: "text/plain" };
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 50);
}

// ─── Upgrade Modal ────────────────────────────────────────────────────────────
function UpgradeModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
        <div className="relative rounded-2xl border border-white/10 bg-[#0c1520]/95 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Gradient accent */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
          <div className="absolute top-[-60px] right-[-40px] w-[200px] h-[200px] bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="p-6 sm:p-8 flex flex-col gap-6">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="size-4" />
            </button>

            {/* Icon + heading */}
            <div className="flex flex-col items-center text-center gap-3">
              <div className="flex items-center justify-center size-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                <Sparkles className="size-7 text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">
                  Upgrade to Download
                </h2>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                  Downloading prompts is a{" "}
                  <span className="text-amber-400 font-semibold">
                    Pro &amp; Enterprise
                  </span>{" "}
                  feature. Upgrade your plan to export your prompts as files.
                </p>
              </div>
            </div>

            {/* Plan cards */}
            <div className="grid grid-cols-2 gap-3">
              {/* Pro */}
              <div className="flex flex-col gap-2 p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5">
                <span className="text-xs font-black uppercase tracking-widest text-cyan-400">
                  Pro
                </span>
                <ul className="flex flex-col gap-1">
                  {[
                    "Download prompts",
                    "500 prompts/day",
                    "Priority support",
                  ].map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-1.5 text-[11px] text-slate-300"
                    >
                      <span className="size-1.5 rounded-full bg-cyan-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Enterprise */}
              <div className="flex flex-col gap-2 p-4 rounded-xl border border-purple-500/30 bg-purple-500/5">
                <span className="text-xs font-black uppercase tracking-widest text-purple-400">
                  Enterprise
                </span>
                <ul className="flex flex-col gap-1">
                  {[
                    "Download prompts",
                    "Unlimited usage",
                    "Dedicated support",
                  ].map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-1.5 text-[11px] text-slate-300"
                    >
                      <span className="size-1.5 rounded-full bg-purple-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA */}
            <a
              href="/settings/subscriptions/pricing"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-sm shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              View Pricing Plans
              <ArrowRight className="size-4" />
            </a>

            <button
              onClick={onClose}
              className="text-center text-xs text-slate-500 hover:text-slate-300 transition-colors font-medium"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────
export default function PromptEditorView({
  id,
  initialData,
  currentUserId,
}: PromptEditorViewProps & { currentUserId?: string }) {
  const router = useRouter();
  const { profile } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [isPublic, setIsPublic] = useState(initialData.is_public);
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
  } | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [workspaces, setWorkspaces] = useState<any[]>([]);

  const isAuthor = !!currentUserId && currentUserId === initialData.user_id;
  const userPlan = profile?.plan ?? "free";

  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (!currentUserId) return;
      try {
        const { data, error } = await supabase
          .from("workspaces")
          .select("id, name, visibility, user_id")
          .or(`user_id.eq.${currentUserId},visibility.eq.community`);

        if (!error && data) {
          setWorkspaces(data);
        }
      } catch (err) {
        console.error("Error fetching workspaces:", err);
      }
    };
    fetchWorkspaces();
  }, [currentUserId]);

  const handleSave = async (
    title: string,
    text: string,
    categorySlug: string,
    tags: string,
    workspaceId: string | null,
  ) => {
    try {
      setIsSaving(true);

      if (workspaceId) {
        const workspace = workspaces.find(
          (workspace) => workspace.id === workspaceId,
        );

        if (!workspace) {
          console.error("Invalid workspaceID: ", workspaceId);
          return;
        }

        const is_comminity = workspace.visibility == "community";
        console.log("Community: ", is_comminity);
        // Comm owner can change workspace
        // other cant
        // com owner can
        //
        if (is_comminity && !isAuthor) {
          console.log("Not author");
          const { error } = await supabase
            .from("prompts")
            .update({
              content: text,
              snippet:
                text.substring(0, 150) + (text.length > 150 ? "..." : ""),
              tag: tags,
            })
            .eq("id", id);
          if (error) {
            console.error(error);
          }
          return;
        }
      }

      if (isAuthor) {
        // Update existing prompt
        const { error } = await supabase
          .from("prompts")
          .update({
            title,
            content: text,
            snippet: text.substring(0, 150) + (text.length > 150 ? "..." : ""),
            icon: categorySlug,
            tag: tags,
            workspace_id: workspaceId || null,
          })
          .eq("id", id);

        if (error) {
          console.error("Failed to update prompt:", error);
        }
      } else {
        // Create a new prompt (copy) for the current user
        const { error } = await supabase.from("prompts").insert({
          title,
          content: text,
          snippet: text.substring(0, 150) + (text.length > 150 ? "..." : ""),
          raw_input: text,
          target_model: initialData.target_model,
          user_id: currentUserId,
          is_public: isPublic,
          icon: categorySlug,
          tag: tags,
          workspace_id: workspaceId || null,
        });

        if (error) {
          console.error("Failed to create new prompt copy:", error);
        }
      }
    } catch (err) {
      console.error("Error saving prompt:", err);
    } finally {
      setIsSaving(false);
      if (workspaceId) {
        router.push(`/workspace/${workspaceId}`);
      } else {
        router.push("/history");
      }
    }
  };

  const handleDiscard = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/library");
    }
  };

  const handleVisibilityChange = async (newVisibility: boolean) => {
    // Only author can change visibility on the actual record
    if (!isAuthor) {
      setIsPublic(newVisibility);
      setNotification({
        message: `Visibility set to ${newVisibility ? "Public" : "Private"} (will be saved when you save your copy)`,
        type: "info",
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
        setNotification({
          message: "Failed to update visibility",
          type: "error",
        });
        console.error("Error updating visibility:", error);
      } else {
        setIsPublic(newVisibility);
        setNotification({
          message: `Prompt is now ${newVisibility ? "Public" : "Private"}`,
          type: "success",
        });
      }
    } catch (err) {
      setNotification({ message: "An error occurred", type: "error" });
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = (
    text: string,
    title: string,
    formatParam?: string,
  ) => {
    if (userPlan === "free") {
      setShowUpgradeModal(true);
      return;
    }

    const downloadFormat = (
      formatParam ||
      initialData.format ||
      "text"
    ).toLowerCase();
    let ext = "txt";
    let mime = "text/plain";

    if (downloadFormat === "json") {
      ext = "json";
      mime = "application/json";
    } else if (downloadFormat === "yaml" || downloadFormat === "yml") {
      ext = "yaml";
      mime = "text/yaml";
    } else if (downloadFormat === "markdown" || downloadFormat === "md") {
      ext = "md";
      mime = "text/markdown";
    }

    const filename = `${slugify(title) || "prompt"}.${ext}`;

    const blob = new Blob([text], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    setNotification({ message: `Downloaded as ${filename}`, type: "success" });
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
        initialTags={initialData.tag || ""}
        initialWorkspaceId={initialData.workspace_id}
        availableWorkspaces={workspaces}
        onDiscard={handleDiscard}
        onSave={handleSave}
        onVisibilityChange={handleVisibilityChange}
        onDownload={(text, title) =>
          handleDownload(text, title, initialData.format)
        }
        userPlan={userPlan}
        isLoading={isSaving}
        target={initialData.target}
        className="pt-0 pb-0 px-0 sm:px-0"
      />

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {showUpgradeModal && (
        <UpgradeModal onClose={() => setShowUpgradeModal(false)} />
      )}
    </main>
  );
}
