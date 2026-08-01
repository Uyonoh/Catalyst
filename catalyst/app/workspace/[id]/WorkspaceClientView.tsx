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
  LayoutGrid,
  List,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../lib/supabase-browser";
import Link from "next/link";
import { toggleFavoritePrompt, checkPromptFavoriteStatus } from "../../lib/prompts-client";
import {
  PROMPT_TYPE_TOKENS,
  PROMPT_TYPE_FALLBACK,
  MODEL_BADGE_TOKENS,
  MODEL_BADGE_FALLBACK,
} from "../../lib/promptTokens";

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
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"masonry" | "list">("masonry");

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

  // Extract unique tags
  const uniqueTags = React.useMemo(() => {
    const tags = new Set<string>();
    filteredPrompts.forEach((p) => {
      if (p.tag) tags.add(p.tag);
    });
    return Array.from(tags);
  }, [filteredPrompts]);

  // Apply tag filter
  const displayedPrompts = selectedTag
    ? filteredPrompts.filter((p) => p.tag === selectedTag)
    : filteredPrompts;

  // Distribute prompts into columns for true responsive Masonry grid
  const masonryColumns2 = React.useMemo(() => {
    const cols: PromptItem[][] = [[], []];
    displayedPrompts.forEach((item, idx) => {
      cols[idx % 2].push(item);
    });
    return cols;
  }, [displayedPrompts]);

  const masonryColumns3 = React.useMemo(() => {
    const cols: PromptItem[][] = [[], [], []];
    displayedPrompts.forEach((item, idx) => {
      cols[idx % 3].push(item);
    });
    return cols;
  }, [displayedPrompts]);

  const renderPromptCard = (prompt: PromptItem) => {
    const canEditPrompt = currentUserId === prompt.user_id || isWorkspaceOwner;
    const promptTypeToken =
      PROMPT_TYPE_TOKENS[prompt.icon] || PROMPT_TYPE_FALLBACK;
    const { Icon } = promptTypeToken;

    return (
      <div
        key={prompt.id}
        onClick={() => router.push(`/studio/${prompt.id}`)}
        className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-cyan-500/30 bg-white/5 hover:bg-white/10 transition-all duration-300 flex flex-col group cursor-pointer relative overflow-hidden h-auto animate-in fade-in slide-in-from-bottom-3 duration-300"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`size-9 rounded-lg ${promptTypeToken.bg} flex items-center justify-center ${promptTypeToken.text} border ${promptTypeToken.border} group-hover:scale-105 transition-transform flex-shrink-0`}
            >
              <Icon className="size-4.5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-white font-bold text-sm leading-tight group-hover:text-cyan-400 transition-colors truncate">
                {prompt.title}
              </h3>
              <p className="text-slate-500 text-[10px] mt-0.5 truncate">
                {new Date(prompt.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-cyan-400 flex-shrink-0">
            {prompt.target_model}
          </span>
        </div>

        {/* Content area - Image or text snippet */}
        {prompt.target?.output_type === "image" && prompt.target?.output ? (
          <div className="relative aspect-video mb-3 overflow-hidden rounded-xl bg-white/5 border border-white/5 group-hover:scale-[1.01] transition-transform duration-300">
            <img
              src={prompt.target.output}
              alt={prompt.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        ) : (
          <p className="text-slate-300 text-xs line-clamp-4 leading-relaxed mb-3 overflow-hidden italic bg-white/5 p-3 rounded-xl border border-white/5 font-mono opacity-90">
            "{prompt.snippet || prompt.content.substring(0, 120)}"
          </p>
        )}

        {/* Tag */}
        {prompt.tag && (
          <div className="mb-3">
            <span className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-medium text-slate-300 border border-white/5 uppercase">
              {prompt.tag}
            </span>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/5">
          <span className="text-[9px] font-bold text-slate-500 flex items-center gap-1 truncate">
            <User className="size-2.5 flex-shrink-0" />
            Added by{" "}
            {currentUserId === prompt.user_id ? "You" : prompt.authorName}
          </span>

          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={(e) => handleFavoritePrompt(e, prompt)}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                prompt.is_favorite
                  ? "text-yellow-400 hover:text-yellow-350"
                  : "text-slate-400 hover:text-yellow-400 hover:bg-white/5"
              }`}
              title={prompt.is_favorite ? "Unfavourite" : "Favourite"}
            >
              <Star
                className={`size-3.5 ${prompt.is_favorite ? "fill-yellow-400" : ""}`}
              />
            </button>

            <button
              onClick={(e) => handleCopy(e, prompt.id, prompt.content)}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
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
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
                  title="Edit prompt"
                >
                  <Edit className="size-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPromptToDelete(prompt);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
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
  };

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
              ({displayedPrompts.length})
            </span>
          </h2>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 min-w-[200px] sm:w-64">
              <Search className="absolute left-3 top-2.5 size-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search prompts..."
                className="w-full bg-white/5 border border-white/5 hover:border-white/10 rounded-xl text-white text-xs pl-9 pr-4 py-2.5 outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>

            {/* View mode toggle */}
            <div className="flex bg-white/5 rounded-xl border border-white/5 p-1">
              <button
                onClick={() => setViewMode("masonry")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === "masonry"
                    ? "bg-white/10 text-cyan-400 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Masonry View"
              >
                <LayoutGrid className="size-4.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white/10 text-cyan-400 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
                title="List View"
              >
                <List className="size-4.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Tag Filters */}
        {uniqueTags.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 dropdown-scroll">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                !selectedTag
                  ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.2)]"
                  : "bg-white/5 text-slate-400 border-white/5 hover:border-white/10 hover:text-slate-200"
              }`}
            >
              All Categories
            </button>
            {uniqueTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                  selectedTag === tag
                    ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.2)]"
                    : "bg-white/5 text-slate-400 border-white/5 hover:border-white/10 hover:text-slate-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

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
        {displayedPrompts.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-white/5 rounded-2xl glass-panel">
            <Sparkles className="size-10 text-slate-600 mx-auto mb-3 opacity-40" />
            <h3 className="text-white font-bold text-sm mb-1">
              No prompts found
            </h3>
            <p className="text-slate-500 text-xs max-w-xs mx-auto">
              {searchQuery || selectedTag
                ? "No prompts match your current search query or filter."
                : "There are no engineering prompts in this workspace yet."}
            </p>
          </div>
        ) : viewMode === "masonry" ? (
          /* MASONRY VIEW LAYOUT */
          <div className="w-full animate-slideUp">
            {/* Desktop 3 Columns */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-4 items-start w-full">
              {masonryColumns3.map((col, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-4 min-w-0">
                  {col.map((prompt) => renderPromptCard(prompt))}
                </div>
              ))}
            </div>

            {/* Tablet 2 Columns */}
            <div className="hidden sm:grid lg:hidden sm:grid-cols-2 gap-4 items-start w-full">
              {masonryColumns2.map((col, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-4 min-w-0">
                  {col.map((prompt) => renderPromptCard(prompt))}
                </div>
              ))}
            </div>

            {/* Mobile 1 Column */}
            <div className="flex sm:hidden flex-col gap-4 w-full">
              {displayedPrompts.map((prompt) => renderPromptCard(prompt))}
            </div>
          </div>
        ) : (
          /* LIST VIEW LAYOUT */
          <div className="flex flex-col gap-3 animate-slideUp">
            {displayedPrompts.map((prompt, idx) => {
              const canEditPrompt =
                currentUserId === prompt.user_id || isWorkspaceOwner;

              const promptTypeToken =
                PROMPT_TYPE_TOKENS[prompt.icon] || PROMPT_TYPE_FALLBACK;

              const modelColorMap: Record<string, string> = {
                gpt: "green",
                "gpt-4": "green",
                "gpt-4-turbo": "green",
                "gpt-4o": "green",
                claude: "purple",
                "claude-3-opus": "purple",
                "claude-3-sonnet": "purple",
                "claude-3-haiku": "purple",
                gemini: "yellow",
                "gemini-1.5-pro": "yellow",
                "gemini-1.5-flash": "yellow",
                llama: "orange",
                "llama-3": "orange",
                "llama-3.1": "orange",
                grok: "cyan",
                dalle: "pink",
                "dall-e-3": "pink",
                stablediffusion: "blue",
                "stable-diffusion-xl": "blue",
                midjourney: "cyan",
                "midjourney-v6": "cyan",
                veo: "rose",
              };
              const modelColor =
                modelColorMap[prompt.target_model.toLowerCase()] || "cyan";
              const modelToken =
                MODEL_BADGE_TOKENS[modelColor] || MODEL_BADGE_FALLBACK;

              return (
                <div
                  key={prompt.id}
                  onClick={() => router.push(`/studio/${prompt.id}`)}
                  className="glass-panel rounded-xl p-4 border border-white/5 hover:border-cyan-500/30 hover:bg-white/[0.03] transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group cursor-pointer animate-in fade-in slide-in-from-bottom-2 duration-300"
                  style={{ animationDelay: `${idx * 20}ms` }}
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div
                      className={`size-9 rounded-lg ${promptTypeToken.bg} flex items-center justify-center ${promptTypeToken.text} border ${promptTypeToken.border} group-hover:scale-105 transition-transform flex-shrink-0`}
                    >
                      <promptTypeToken.Icon className="size-4.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors truncate">
                          {prompt.title}
                        </h3>
                        {prompt.tag && (
                          <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] text-slate-400 border border-white/5 uppercase flex-shrink-0">
                            {prompt.tag}
                          </span>
                        )}
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                            prompt.target?.output_type === "image"
                              ? "bg-pink-500/10 text-pink-400"
                              : "bg-white/5 text-slate-500"
                          }`}
                        >
                          {prompt.target?.output_type === "image"
                            ? "Image"
                            : "Text"}
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs line-clamp-1">
                        {prompt.snippet}
                      </p>
                    </div>
                  </div>

                  {prompt.target?.output_type === "image" &&
                  prompt.target?.output && (
                    <div className="relative w-24 h-16 sm:w-28 sm:h-18 flex-shrink-0 overflow-hidden rounded-lg bg-white/5">
                      <img
                        src={prompt.target.output}
                        alt={prompt.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex items-center gap-1 px-2 py-0.5 rounded ${modelToken.bg} border ${modelToken.border} ${modelToken.text}`}
                      >
                        <span className="text-[9px] font-black uppercase tracking-wider">
                          {prompt.target_model}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-500 font-medium">
                        {new Date(prompt.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleFavoritePrompt(e, prompt)}
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                          prompt.is_favorite
                            ? "text-yellow-400 hover:text-yellow-350"
                            : "text-slate-400 hover:text-yellow-400 hover:bg-white/5"
                        }`}
                        title={prompt.is_favorite ? "Unfavourite" : "Favourite"}
                      >
                        <Star
                          className={`size-3.5 ${prompt.is_favorite ? "fill-yellow-400" : ""}`}
                        />
                      </button>

                      <button
                        onClick={(e) =>
                          handleCopy(e, prompt.id, prompt.content)
                        }
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${
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
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
                            title="Edit prompt"
                          >
                            <Edit className="size-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPromptToDelete(prompt);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
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
