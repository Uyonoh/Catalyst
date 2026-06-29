"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, X, SlidersHorizontal, Globe, Users, Eye, FolderPlus, Loader2, PlusCircle, AlertTriangle } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import WorkspaceFilters from "./WorkspaceFilters";
import { useUser } from "../../context/AuthContext";
import { supabaseBrowser } from "../../lib/supabase-browser";

export default function WorkspaceSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { user, profile } = useUser();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Creation modal states
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState("");
  const [newWorkspaceVisibility, setNewWorkspaceVisibility] = useState<
    "private" | "public" | "community"
  >("private");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [workspacesCount, setWorkspacesCount] = useState(0);

  const PLAN_LIMITS: Record<string, { workspaces: number; prompts: number }> = {
    free: { workspaces: 0, prompts: 20 },
    basic: { workspaces: 3, prompts: 50 },
    plus: { workspaces: 10, prompts: 100 },
    pro: { workspaces: 30, prompts: 200 },
    ultra: { workspaces: Infinity, prompts: Infinity },
  };

  const userPlan = profile?.plan || "free";
  const workspaceLimit = PLAN_LIMITS[userPlan]?.workspaces || 0;
  const isLimitReached = workspacesCount >= workspaceLimit;

  useEffect(() => {
    if (user) {
      supabaseBrowser
        .from("workspaces")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .then(({ count }) => {
          setWorkspacesCount(count || 0);
        });
    }
  }, [user, isCreating]);

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
        setNewWorkspaceName("");
        setNewWorkspaceDesc("");
        setNewWorkspaceVisibility("private");
        setIsCreating(false);
        // Redirect to the newly created workspace
        router.push(`/workspace/${data.id}`);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to create workspace");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Visibility is 'all' by default, or read from url
  const currentVisibility = searchParams.get("visibility") || "all";

  const activeFilterCount = [
    searchParams.get("visibility") ? "visibility" : null,
    searchParams.get("sort") && searchParams.get("sort") !== "newest" ? "sort" : null,
  ].filter(Boolean).length;

  const scrollToSearch = () => {
    const el = document.getElementById("search-section");
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Debounced search logic
  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (searchTerm === currentQ) return;

    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm) {
        params.set("q", searchTerm);
      } else {
        params.delete("q");
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
      if (searchTerm) scrollToSearch();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, pathname, router, searchParams]);

  // Focus search input on Ctrl/Cmd + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("workspace-search-input")?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Quick visibility toggle handler
  const handleVisibilityChange = (vis: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (vis === "all") {
      params.delete("visibility");
    } else {
      params.set("visibility", vis);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <div id="search-section" className="flex flex-col gap-3 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="flex-1 group">
            <div className="flex w-full items-center rounded-xl h-12 glass-panel border border-white/10 overflow-hidden px-4 transition-all duration-300 focus-within:border-cyan-500/50 focus-within:shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Search className="size-5 text-cyan-400 mr-3 shrink-0" />
              <input
                id="workspace-search-input"
                className="w-full bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 text-base focus:outline-none"
                placeholder="Search workspaces by name or description..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="hidden sm:flex text-xs text-slate-500 border border-white/10 rounded px-2 py-0.5 font-mono shrink-0">
                ⌘K
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2 shrink-0 justify-end sm:justify-start">
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className={`h-12 px-4 rounded-xl glass-panel text-white hover:bg-white/10 border flex items-center gap-2 transition-all active:scale-95 ${
                isFiltersOpen ? "border-cyan-500/50 bg-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.2)]" : "border-white/10"
              }`}
            >
              {isFiltersOpen ? <X className="size-5 text-cyan-400" /> : <SlidersHorizontal className="size-5 text-cyan-400" />}
              <span className="text-sm font-medium">Filters</span>
              {activeFilterCount > 0 && (
                <span className="ml-1 w-5 h-5 rounded-full bg-cyan-500 text-[#101922] text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <button
              className="h-12 w-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white flex items-center justify-center hover:opacity-90 transition-all shadow-lg hover:shadow-cyan-500/20 active:scale-95 cursor-pointer"
              title="Create New Workspace"
              onClick={() => {
                if (!user) {
                  router.push("/login");
                } else {
                  setIsCreating(true);
                }
              }}
            >
              <Plus className="size-6 font-bold" />
            </button>
          </div>
        </div>

        {/* Quick Filter Chips (Mobile-First / Tabbed Layout) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {[
            { label: "All", value: "all", icon: Eye },
            { label: "Public", value: "public", icon: Globe },
            { label: "Community", value: "community", icon: Users },
          ].map((chip) => {
            const Icon = chip.icon;
            const isSelected = currentVisibility === chip.value;
            return (
              <button
                key={chip.value}
                onClick={() => handleVisibilityChange(chip.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                  isSelected
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                    : "bg-white/5 text-slate-400 border-white/5 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="size-3.5" />
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      <WorkspaceFilters isOpen={isFiltersOpen} onClose={() => setIsFiltersOpen(false)} />

      {/* Creation Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setIsCreating(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-xl border border-white/10 bg-[#0c1520] p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <FolderPlus className="size-5" />
              </div>
              <div>
                <h3 className="text-white font-bold text-base">Create New Workspace</h3>
                <p className="text-slate-400 text-xs mt-0.5">Initialize a new engineering workspace</p>
              </div>
            </div>

            {isLimitReached ? (
              <div className="flex flex-col gap-4 py-2">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="size-5" />
                  <h4 className="font-bold text-sm">Workspace Limit Reached</h4>
                </div>
                <p className="text-xs text-slate-300">
                  Your current plan ({userPlan.toUpperCase()}) allows up to {workspaceLimit} workspaces. You are currently using {workspacesCount}.
                </p>
                <div className="flex justify-between items-center mt-2 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2.5 rounded-lg border border-white/10 text-xs font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      router.push("/settings/subscriptions/pricing");
                    }}
                    className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold transition-all shadow-lg hover:shadow-cyan-500/10 active:scale-95 cursor-pointer"
                  >
                    Upgrade Plan
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateWorkspace} className="flex flex-col gap-4">
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

                <div className="flex items-center justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !newWorkspaceName.trim()}
                    className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold hover:opacity-90 transition-all shadow-lg active:scale-95 flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="size-4" />
                        <span>Create Workspace</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
