"use client";

import React, { useState } from "react";
import {
  Folder,
  Lock,
  Globe,
  Users,
  Search,
  Sparkles,
  Trash2,
  Edit,
  Copy,
  Check,
  Calendar,
  User,
  ArrowLeft,
  X,
  Save,
  Plus,
  Loader2,
  AlertTriangle,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../lib/supabase-browser";
import Link from "next/link";
import { toggleFavoritePrompt, checkPromptFavoriteStatus } from "../../lib/prompts-client";

interface PromptItem {
  id: string;
  title: string;
  content: string;
  snippet: string;
  target_model: string;
  tag: string;
  icon: string;
  created_at: string;
  user_id: string;
  authorName: string;
  is_favorite?: boolean;
  target?: {
    output_type?: string;
    output?: string;
    negative_prompt?: string;
    aspect_ratio?: string;
  };
}

interface WorkspaceData {
  id: string;
  name: string;
  description: string | null;
  visibility: string;
  user_id: string;
  created_at: string;
  creatorName: string;
}

interface WorkspaceClientViewProps {
  workspace: WorkspaceData;
  initialPrompts: PromptItem[];
  currentUserId?: string;
}

export default function WorkspaceClientView({
  workspace: initialWorkspace,
  initialPrompts = [],
  currentUserId,
}: WorkspaceClientViewProps) {
  const router = useRouter();

  // Workspace metadata state
  const [workspace, setWorkspace] = useState<WorkspaceData>(initialWorkspace);
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [editName, setEditName] = useState(workspace.name);
  const [editDesc, setEditDesc] = useState(workspace.description || "");
  const [editVisibility, setEditVisibility] = useState<
    "private" | "public" | "community"
  >(workspace.visibility as any);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState("");

  // Prompts search & copy state
  const [prompts, setPrompts] = useState<PromptItem[]>(initialPrompts);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Prompt CRUD operations
  const [promptToDelete, setPromptToDelete] = useState<PromptItem | null>(null);
  const [isDeletingPrompt, setIsDeletingPrompt] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Permissions helper
  const isWorkspaceOwner = currentUserId === workspace.user_id;
  const canAddPrompts =
    isWorkspaceOwner || workspace.visibility === "community";

  const handleCopy = async (e: React.MouseEvent, id: string, text: string) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy prompt content:", err);
    }
  };

  const handleFavoritePrompt = async (e: React.MouseEvent, prompt: PromptItem) => {
    e.stopPropagation();
    if (!currentUserId) return;
    try {
      const { action } = await toggleFavoritePrompt(currentUserId, prompt);
      const isFav = action === "favorited" || action === "duplicated";
      setPrompts((prev) =>
        prev.map((p) => (p.id === prompt.id ? { ...p, is_favorite: isFav } : p))
      );
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  // Sync favorites on load
  React.useEffect(() => {
    if (!currentUserId || !initialPrompts.length) return;
    let active = true;
    const checkStatuses = async () => {
      const updatedPrompts = await Promise.all(
        initialPrompts.map(async (p) => {
          if (p.user_id === currentUserId) return { ...p, is_favorite: p.is_favorite || false };
          try {
            const isFav = await checkPromptFavoriteStatus(currentUserId, p);
            return { ...p, is_favorite: isFav };
          } catch {
            return { ...p, is_favorite: false };
          }
        })
      );
      if (active) {
        setPrompts(updatedPrompts);
      }
    };
    checkStatuses();
    return () => {
      active = false;
    };
  }, [currentUserId, initialPrompts]);

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    setIsSavingSettings(true);
    setSettingsError("");

    try {
      const { error } = await supabaseBrowser
        .from("workspaces")
        .update({
          name: editName.trim(),
          description: editDesc.trim() || null,
          visibility: editVisibility,
        })
        .eq("id", workspace.id);

      if (error) throw error;

      setWorkspace({
        ...workspace,
        name: editName.trim(),
        description: editDesc.trim() || null,
        visibility: editVisibility,
      });
      setIsEditingSettings(false);
    } catch (err: any) {
      console.error("Error updating workspace settings:", err);
      setSettingsError(err.message || "Failed to update workspace settings");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleDeletePrompt = async () => {
    if (!promptToDelete) return;
    setIsDeletingPrompt(true);
    setDeleteError("");

    try {
      const { error } = await supabaseBrowser
        .from("prompts")
        .delete()
        .eq("id", promptToDelete.id);

      if (error) throw error;

      setPrompts(prompts.filter((p) => p.id !== promptToDelete.id));
      setPromptToDelete(null);
    } catch (err: any) {
      console.error("Error deleting prompt:", err);
      setDeleteError(err.message || "Failed to delete prompt");
    } finally {
      setIsDeletingPrompt(false);
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "public":
        return <Globe className="size-4 text-emerald-400 animate-pulse" />;
      case "community":
        return <Users className="size-4 text-cyan-400 animate-pulse" />;
      default:
        return <Lock className="size-4 text-slate-400" />;
    }
  };

  const getVisibilityBadgeStyle = (visibility: string) => {
    switch (visibility) {
      case "public":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
      case "community":
        return "bg-cyan-500/10 border-cyan-500/20 text-cyan-400";
      default:
        return "bg-white/5 border-white/10 text-slate-400";
    }
  };

  // Filter prompts by search query
  const filteredPrompts = prompts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.target_model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tag && p.tag.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <main className="flex-1 w-full max-w-[1100px] mx-auto pt-24 pb-12 px-4 md:px-8 relative z-10">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors bg-white/5 border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-xl active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="size-3.5" />
          <span>Dashboard</span>
        </Link>
      </div>

      {/* Main Workspace Glass Header Panel */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 mb-8 border border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-all pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span
                className={`flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg border ${getVisibilityBadgeStyle(workspace.visibility)}`}
              >
                {getVisibilityIcon(workspace.visibility)}
                {workspace.visibility}
              </span>
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                <User className="size-3" />
                By {isWorkspaceOwner ? "You" : workspace.creatorName}
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-none">
              {workspace.name}
            </h1>
            <p className="text-slate-400 text-sm md:text-base mt-2 leading-relaxed max-w-2xl">
              {workspace.description ||
                "No description provided for this engineering workspace."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isWorkspaceOwner && (
              <button
                onClick={() => setIsEditingSettings(!isEditingSettings)}
                className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Edit className="size-3.5" />
                Edit Settings
              </button>
            )}

            {canAddPrompts && (
              <Link
                href={`/studio?workspace=${workspace.id}`}
                className="px-5 py-2.5 text-xs font-black text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-neon hover:shadow-neon-strong transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="size-4" />
                Create Prompt
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Workspace Settings form (inline modal/expander) */}
      {isEditingSettings && (
        <form
          onSubmit={handleUpdateSettings}
          className="glass-panel border border-white/10 rounded-2xl p-6 mb-8 animate-slideDown flex flex-col gap-4"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-white font-bold text-sm flex items-center gap-1.5">
              <Folder className="size-4 text-cyan-400" />
              Workspace Configuration
            </h3>
            <button
              type="button"
              onClick={() => setIsEditingSettings(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Workspace Name
              </label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg text-white text-xs p-2.5 outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Visibility
              </label>
              <select
                value={editVisibility}
                onChange={(e: any) => setEditVisibility(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg text-slate-200 text-xs p-2.5 outline-none focus:border-cyan-500 transition-colors cursor-pointer"
              >
                <option value="private">Private (Only me)</option>
                <option value="public">Public (Read-only for others)</option>
                <option value="community">
                  Community (Read-write for others)
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Description
            </label>
            <input
              type="text"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg text-white text-xs p-2.5 outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {settingsError && (
            <span className="text-xs text-rose-400 font-medium">
              {settingsError}
            </span>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditingSettings(false)}
              className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSavingSettings || !editName.trim()}
              className="px-5 py-2.5 text-xs font-bold text-white bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-all flex items-center gap-1 disabled:opacity-50 cursor-pointer"
            >
              {isSavingSettings ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Save className="size-3.5" />
              )}
              Save Configuration
            </button>
          </div>
        </form>
      )}

      {/* Prompts list section */}
      <div className="flex flex-col gap-6">
        {/* Search header & filter bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-white font-bold text-lg flex items-center gap-2 self-start">
            Workspace Prompts
            <span className="text-xs font-normal text-slate-400">
              ({filteredPrompts.length})
            </span>
          </h2>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 size-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts..."
              className="w-full bg-white/5 border border-white/5 hover:border-white/10 rounded-xl text-white text-xs pl-9 pr-4 py-2.5 outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Delete Prompt Confirmation Modal */}
        {promptToDelete && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
              onClick={() => setPromptToDelete(null)}
            />
            <div className="relative z-10 w-full max-w-sm rounded-xl border border-rose-500/20 bg-[#0c1520] p-6 shadow-2xl animate-in fade-in zoom-in-95">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-rose-500/10 p-2.5 rounded-lg text-rose-400 border border-rose-500/20">
                  <AlertTriangle className="size-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">
                    Delete Prompt
                  </h3>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    Are you sure you want to delete{" "}
                    <span className="text-white font-semibold">
                      "{promptToDelete.title}"
                    </span>
                    ? This action cannot be undone and will permanently remove
                    this prompt.
                  </p>
                </div>
              </div>
              {deleteError && (
                <span className="text-[10px] text-rose-400 font-medium block mb-2">
                  {deleteError}
                </span>
              )}
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setPromptToDelete(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePrompt}
                  disabled={isDeletingPrompt}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-lg shadow-lg shadow-rose-500/10 transition-all flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                >
                  {isDeletingPrompt ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Trash2 className="size-3" />
                  )}
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Prompts list grid */}
        {filteredPrompts.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-white/5 rounded-2xl glass-panel">
            <Sparkles className="size-10 text-slate-600 mx-auto mb-3 opacity-40" />
            <h3 className="text-white font-bold text-sm mb-1">
              No prompts found
            </h3>
            <p className="text-slate-500 text-xs max-w-xs mx-auto">
              {searchQuery
                ? "No prompts match your current search query."
                : "There are no engineering prompts in this workspace yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPrompts.map((prompt) => {
              // User can edit/delete if they created the prompt OR they own the workspace
              const canEditPrompt =
                currentUserId === prompt.user_id || isWorkspaceOwner;

              return (
                <div
                  key={prompt.id}
                  onClick={() => router.push(`/studio/${prompt.id}`)}
                  className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-cyan-500/30 bg-white/5 hover:bg-white/10 transition-all duration-300 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
                >
                  <div className="flex-1 min-w-0">
                    {/* Model tag and date */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 roundedbg-black/40 border border-white/10 text-cyan-400">
                        {prompt.target_model}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Calendar className="size-3" />
                        {new Date(prompt.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-white font-bold text-sm tracking-tight group-hover:text-cyan-400 transition-colors truncate">
                      {prompt.title}
                    </h3>

                    <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed mt-2 overflow-hidden italic">
                      "{prompt.snippet || prompt.content.substring(0, 120)}"
                    </p>
                  </div>

                  {/* Actions / details bar */}
                  <div className="border-t border-white/5 pt-3 mt-4 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                      <User className="size-3" />
                      Added by{" "}
                      {currentUserId === prompt.user_id
                        ? "You"
                        : prompt.authorName}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleFavoritePrompt(e, prompt)}
                        className={`p-2 rounded-lg transition-all cursor-pointer ${
                          prompt.is_favorite
                            ? "text-yellow-400 hover:text-yellow-350"
                            : "text-slate-400 hover:text-yellow-400 hover:bg-white/5"
                        }`}
                        title={prompt.is_favorite ? "Unfavourite" : "Favourite"}
                      >
                        <Star className={`size-3.5 ${prompt.is_favorite ? "fill-yellow-400" : ""}`} />
                      </button>

                      <button
                        onClick={(e) =>
                          handleCopy(e, prompt.id, prompt.content)
                        }
                        className={`p-2 rounded-lg transition-all cursor-pointer ${
                          copiedId === prompt.id
                            ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/10"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                        title="Copy prompt text"
                      >
                        {copiedId === prompt.id ? (
                          <Check className="size-3.5" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </button>

                      {canEditPrompt && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/studio/${prompt.id}`);
                            }}
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
                            title="Edit prompt"
                          >
                            <Edit className="size-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPromptToDelete(prompt);
                            }}
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                            title="Delete prompt"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
