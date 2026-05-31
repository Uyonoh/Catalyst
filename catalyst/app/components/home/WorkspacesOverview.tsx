"use client";

import React, { useState } from "react";
import {
  Folder,
  FolderPlus,
  Loader2,
  ArrowUpRight,
  Search,
  PlusCircle,
} from "lucide-react";
import { useUser } from "../../context/AuthContext";
import { supabaseBrowser } from "../../lib/supabase-browser";

interface WorkspaceItem {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
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
  const [workspaces, setWorkspaces] =
    useState<WorkspaceItem[]>(initialWorkspaces);
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderDesc, setNewFolderDesc] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim() || !user) return;

    setIsLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabaseBrowser
        .from("workspaces")
        .insert({
          name: newFolderName.trim(),
          description: newFolderDesc.trim() || null,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        setWorkspaces([data as WorkspaceItem, ...workspaces]);
        setNewFolderName("");
        setNewFolderDesc("");
        setIsCreating(false);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to create folder");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 mb-8 relative border border-white/5 shadow-xl animate-fadeIn z-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-base flex items-center gap-2">
          <Folder className="size-4.5 text-cyan-400" />
          Active Workspaces & Folders
        </h3>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="text-xs font-bold text-cyan-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
        >
          <FolderPlus className="size-5 sm:size-3.5" />
          <span className="hidden sm:inline">
            {isCreating ? "Cancel" : "New Folder"}
          </span>
        </button>
      </div>

      {/* Creation form */}
      {isCreating && (
        <form
          onSubmit={handleCreateWorkspace}
          className="p-4 rounded-xl bg-white/5 border border-white/5 mb-4 animate-slideDown"
        >
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Folder Name *
              </label>
              <input
                type="text"
                required
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="E.g., Production Copilot"
                maxLength={40}
                className="w-full bg-black/40 border border-white/10 rounded-lg text-white text-xs p-2 outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Description (Optional)
              </label>
              <input
                type="text"
                value={newFolderDesc}
                onChange={(e) => setNewFolderDesc(e.target.value)}
                placeholder="Briefly describe the design scope..."
                maxLength={80}
                className="w-full bg-black/40 border border-white/10 rounded-lg text-white text-xs p-2 outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            {errorMsg && (
              <span className="text-[10px] text-rose-400 font-medium">
                {errorMsg}
              </span>
            )}
            <button
              type="submit"
              disabled={isLoading || !newFolderName.trim()}
              className="mt-1 flex items-center justify-center gap-1.5 w-full py-2 bg-gradient-to-r from-[--color-primary] to-cyan-500 text-white text-xs font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <>
                  <PlusCircle className="size-3.5" />
                  Initialize Workspace
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Workspaces list */}
      {workspaces.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-white/5 rounded-xl">
          <Folder className="size-8 text-slate-600 mx-auto mb-2 opacity-50" />
          <span className="text-slate-500 text-xs font-medium">
            No custom workspaces found. Group prompts into folders to optimize
            workflow.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1 dropdown-scroll">
          {workspaces.map((folder) => (
            <a
              key={folder.id}
              href={`/studio?workspace=${folder.id}`}
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/20 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-9 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform flex-shrink-0">
                  <Folder className="size-4.5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-white text-xs font-bold truncate group-hover:text-cyan-400 transition-colors">
                    {folder.name}
                  </h4>
                  <p className="text-slate-400 text-[10px] truncate leading-normal">
                    {folder.description || "Active engineering workspace"}
                  </p>
                </div>
              </div>
              <ArrowUpRight className="size-3.5 text-slate-500 group-hover:text-cyan-400 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
