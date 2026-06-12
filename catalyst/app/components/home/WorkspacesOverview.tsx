"use client";

import React, { useState, useEffect } from "react";
import {
  Folder,
  FolderPlus,
  Loader2,
  ArrowUpRight,
  PlusCircle,
  Trash2,
  Lock,
  Globe,
  Users,
  AlertTriangle,
} from "lucide-react";
import { useUser } from "../../context/AuthContext";
import { supabaseBrowser } from "../../lib/supabase-browser";
import Link from "next/link";

interface WorkspaceItem {
  id: string;
  name: string;
  description: string | null;
  visibility: string;
  user_id: string;
  created_at: string;
  profiles?: {
    full_name: string | null;
    email: string | null;
  } | null;
}

interface WorkspacesOverviewProps {
  initialWorkspaces: WorkspaceItem[];
  promptsCount: number;
}

export default function WorkspacesOverview({
  initialWorkspaces = [],
  promptsCount = 0,
}: WorkspacesOverviewProps) {
  const { user } = useUser();

  // State variables
  const [activeTab, setActiveTab] = useState<"mine" | "community">("mine");
  const [myWorkspaces, setMyWorkspaces] =
    useState<WorkspaceItem[]>(initialWorkspaces);
  const [communityWorkspaces, setCommunityWorkspaces] = useState<
    WorkspaceItem[]
  >([]);
  const [isCreating, setIsCreating] = useState(false);

  // Form fields
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState("");
  const [newWorkspaceVisibility, setNewWorkspaceVisibility] = useState<
    "private" | "public" | "community"
  >("private");

  // Loading & error handling
  const [isLoading, setIsLoading] = useState(false);
  const [isCommunityLoading, setIsCommunityLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [workspaceToDelete, setWorkspaceToDelete] =
    useState<WorkspaceItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch community workspaces when active tab changes
  useEffect(() => {
    if (activeTab === "community" && user) {
      fetchCommunityWorkspaces();
    }
  }, [activeTab, user]);

  const fetchCommunityWorkspaces = async () => {
    setIsCommunityLoading(true);
    try {
      const { data, error } = await supabaseBrowser
        .from("workspaces")
        .select(
          `
          id,
          name,
          description,
          visibility,
          user_id,
          created_at,
          profiles (
            full_name,
            email
          )
        `,
        )
        .in("visibility", ["community", "public"])
        .neq("user_id", user?.id)
        .limit(6)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCommunityWorkspaces((data as any) || []);
    } catch (err: any) {
      console.error("Failed to load community workspaces:", err);
    } finally {
      setIsCommunityLoading(false);
    }
  };

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim() || !user) return;

    setIsLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabaseBrowser
        .from("workspaces")
        .insert({
          name: newWorkspaceName.trim(),
          description: newWorkspaceDesc.trim() || null,
          visibility: newWorkspaceVisibility,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        setMyWorkspaces([data as WorkspaceItem, ...myWorkspaces]);
        setNewWorkspaceName("");
        setNewWorkspaceDesc("");
        setNewWorkspaceVisibility("private");
        setIsCreating(false);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to create workspace");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWorkspace = async () => {
    if (!workspaceToDelete || !user) return;
    setIsDeleting(true);
    try {
      const { error } = await supabaseBrowser
        .from("workspaces")
        .delete()
        .eq("id", workspaceToDelete.id);

      if (error) throw error;

      setMyWorkspaces(
        myWorkspaces.filter((w) => w.id !== workspaceToDelete.id),
      );
      setWorkspaceToDelete(null);
    } catch (err: any) {
      console.error("Failed to delete workspace:", err);
      alert(err.message || "Failed to delete workspace");
    } finally {
      setIsDeleting(false);
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "public":
        return <Globe className="size-3 text-emerald-400" />;
      case "community":
        return <Users className="size-3 text-cyan-400" />;
      default:
        return <Lock className="size-3 text-slate-400" />;
    }
  };

  const getVisibilityLabel = (visibility: string) => {
    switch (visibility) {
      case "public":
        return "Public";
      case "community":
        return "Community";
      default:
        return "Private";
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 mb-8 relative border border-white/5 shadow-xl animate-fadeIn z-10">
      {/* Header section with tabs and creator trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-5">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab("mine")}
            className={`text-base font-bold flex items-center gap-2 pb-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "mine"
                ? "text-white border-cyan-400"
                : "text-slate-400 border-transparent hover:text-white"
            }`}
          >
            <Folder className="size-4.5 text-cyan-400" />
            My Workspaces
            <span className="text-xs font-normal opacity-60">
              ({myWorkspaces.length})
            </span>
          </button>
          <button
            onClick={() => setActiveTab("community")}
            className={`text-base font-bold flex items-center gap-2 pb-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "community"
                ? "text-white border-cyan-400"
                : "text-slate-400 border-transparent hover:text-white"
            }`}
          >
            <Users className="size-4.5 text-purple-400" />
            Community Hub
          </button>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="self-start sm:self-center text-xs font-bold text-cyan-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer bg-white/5 border border-white/10 hover:border-cyan-400/30 px-3 py-1.5 rounded-lg active:scale-95"
        >
          <FolderPlus className="size-4" />
          <span>{isCreating ? "Cancel" : "New Workspace"}</span>
        </button>
      </div>

      {/* Creation form */}
      {isCreating && (
        <form
          onSubmit={handleCreateWorkspace}
          className="p-5 rounded-xl bg-white/5 border border-white/10 mb-6 animate-slideDown flex flex-col gap-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Workspace Name *
              </label>
              <input
                type="text"
                required
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                placeholder="E.g., Production Copilot"
                maxLength={40}
                className="w-full bg-black/40 border border-white/10 rounded-lg text-white text-xs p-2.5 outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Privacy / Visibility
              </label>
              <select
                value={newWorkspaceVisibility}
                onChange={(e: any) => setNewWorkspaceVisibility(e.target.value)}
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
              Description (Optional)
            </label>
            <input
              type="text"
              value={newWorkspaceDesc}
              onChange={(e) => setNewWorkspaceDesc(e.target.value)}
              placeholder="Briefly describe the workspace scope..."
              maxLength={80}
              className="w-full bg-black/40 border border-white/10 rounded-lg text-white text-xs p-2.5 outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          {errorMsg && (
            <span className="text-[10px] text-rose-400 font-medium">
              {errorMsg}
            </span>
          )}
          <button
            type="submit"
            disabled={isLoading || !newWorkspaceName.trim()}
            className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-gradient-to-r from-[--color-primary] to-cyan-500 text-white text-xs font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <PlusCircle className="size-4" />
                Initialize Workspace
              </>
            )}
          </button>
        </form>
      )}

      {/* Delete Confirmation Modal */}
      {workspaceToDelete && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setWorkspaceToDelete(null)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-xl border border-rose-500/20 bg-[#0c1520] p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-rose-500/10 p-2.5 rounded-lg text-rose-400 border border-rose-500/20">
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">
                  Delete Workspace
                </h3>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                  Are you sure you want to delete{" "}
                  <span className="text-white font-semibold">
                    "{workspaceToDelete.name}"
                  </span>
                  ? Prompts inside this workspace will remain in your library
                  but won't belong to any workspace.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setWorkspaceToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteWorkspace}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-lg shadow-lg shadow-rose-500/10 transition-all flex items-center gap-1 disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? (
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

      {/* Workspace lists based on tabs */}
      {activeTab === "mine" ? (
        myWorkspaces.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-white/5 rounded-xl">
            <Folder className="size-8 text-slate-600 mx-auto mb-2 opacity-50" />
            <span className="text-slate-500 text-xs font-medium block">
              No workspaces found. Click "New Workspace" to create one.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[260px] overflow-y-auto pr-1 dropdown-scroll">
            {myWorkspaces.map((folder) => (
              <div
                key={folder.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/20 hover:bg-white/10 transition-all duration-300 group relative"
              >
                <Link
                  href={`/workspace/${folder.id}`}
                  className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                >
                  <div className="size-9 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform flex-shrink-0">
                    <Folder className="size-4.5" />
                  </div>
                  <div className="min-w-0 pr-2">
                    <h4 className="text-white text-xs font-bold truncate group-hover:text-cyan-400 transition-colors flex items-center gap-2">
                      {folder.name}
                      <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[8px] font-bold rounded-md bg-white/5 border border-white/5">
                        {getVisibilityIcon(folder.visibility)}
                        {getVisibilityLabel(folder.visibility)}
                      </span>
                    </h4>
                    <p className="text-slate-400 text-[10px] truncate leading-normal mt-0.5">
                      {folder.description || "Active engineering workspace"}
                    </p>
                  </div>
                </Link>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setWorkspaceToDelete(folder);
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    title="Delete workspace"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                  <Link
                    href={`/workspace/${folder.id}`}
                    className="p-1.5 rounded-lg text-slate-500 group-hover:text-cyan-400 transition-colors cursor-pointer"
                  >
                    <ArrowUpRight className="size-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      ) : isCommunityLoading ? (
        <div className="py-8 text-center flex items-center justify-center gap-2">
          <Loader2 className="size-5 animate-spin text-purple-400" />
          <span className="text-slate-400 text-xs">
            Exploring shared workspaces...
          </span>
        </div>
      ) : communityWorkspaces.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-white/5 rounded-xl">
          <Users className="size-8 text-slate-600 mx-auto mb-2 opacity-50" />
          <span className="text-slate-500 text-xs font-medium block">
            No community workspaces found. Make a workspace "Community" to share
            it!
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[260px] overflow-y-auto pr-1 dropdown-scroll">
            {communityWorkspaces.slice(0, 5).map((folder) => {
              const prof: any = Array.isArray(folder.profiles)
                ? folder.profiles[0]
                : folder.profiles;
              const authorName =
                prof?.full_name || prof?.email?.split("@")[0] || "Architect";
              const community = folder.visibility == "community";
              const color = community ? "purple" : "green";
              return (
                <Link
                  key={folder.id}
                  href={`/workspace/${folder.id}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/20 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`size-9 rounded-lg bg-${color}-500/10 flex items-center justify-center text-${color}-400 group-hover:scale-105 transition-transform flex-shrink-0`}
                    >
                      {community ? (
                        <Users className="size-4.5" />
                      ) : (
                        <Globe className="size-4.5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4
                        className={`text-white text-xs font-bold truncate group-hover:text-${color}-400 transition-colors flex items-center gap-2`}
                      >
                        {folder.name}
                        <span
                          className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md bg-${color}-500/10 border border-${color}-500/20 text-${color}-400`}
                        >
                          {community ? "Community" : "Public"}
                        </span>
                      </h4>
                      <p className="text-slate-400 text-[10px] truncate leading-normal mt-0.5">
                        By {authorName} &bull;{" "}
                        {folder.description || "Shared workspace"}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight
                    className={`size-3.5 text-slate-500 group-hover:text-${color}-400 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0`}
                  />
                </Link>
              );
            })}
          </div>
          {communityWorkspaces.length > 5 && (
            <div className="flex justify-center mt-2">
              <Link
                href="/library?view=workspaces"
                className="text-xs font-bold text-cyan-400 hover:text-white transition-colors bg-white/5 border border-white/10 hover:border-cyan-500/30 px-4 py-2 rounded-lg flex items-center gap-1.5 active:scale-95 duration-200"
              >
                <span>View More Workspaces</span>
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
