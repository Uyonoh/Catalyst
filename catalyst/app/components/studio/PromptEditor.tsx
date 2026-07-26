"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GlassPanel from "../GlassPanel";
import { useCatalog } from "../../context/CatalogContext";
import {
  ArrowLeft,
  Loader2,
  Sparkles,
  Copy,
  Check,
  Save,
  Lock,
  Globe,
  MessageSquare,
  Terminal,
  Image as ImageIcon,
  Box,
  Palette,
  Download,
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  chat: MessageSquare,
  auto_awesome: Sparkles,
  terminal: Terminal,
  image: ImageIcon,
  filter_frames: Box,
  palette: Palette,
};

interface PromptEditorProps {
  title?: string;
  initialEditedText: string;
  initialRawIntent: string;
  isAuthor: boolean;
  isPublic?: boolean;
  selectedModelId?: string;
  initialCategory?: string;
  initialTags?: string;
  initialWorkspaceId?: string | null;
  availableWorkspaces?: {
    id: string;
    name: string;
    visibility: string;
    user_id: string;
  }[];
  onDiscard?: () => void;
  onSave?: (
    title: string,
    text: string,
    category: string,
    tags: string,
    workspaceId: string | null,
  ) => void;
  onVisibilityChange?: (isPublic: boolean) => void;
  onDownload?: (text: string, title: string) => void;
  userPlan?: "free" | "basic" | "plus" | "pro" | "ultra";
  isLoading?: boolean;
  className?: string;
  target?: {
    output_type?: string;
    output?: string;
    negative_prompt?: string;
    aspect_ratio?: string;
  };
}

export default function PromptEditor({
  title = "Refined Output",
  initialEditedText,
  initialRawIntent,
  isAuthor,
  isPublic = false,
  selectedModelId,
  initialCategory = "chat",
  initialTags = "",
  initialWorkspaceId = null,
  availableWorkspaces = [],
  onDiscard,
  onSave,
  onVisibilityChange,
  onDownload,
  userPlan = "free",
  isLoading = false,
  target,
  className,
}: PromptEditorProps) {
  const canDownload = userPlan !== "free";
  const router = useRouter();
  const { models, categories } = useCatalog();
  const [editedText, setEditedText] = useState(initialEditedText);
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory || "",
  );
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedTags, setEditedTags] = useState(initialTags);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>(
    initialWorkspaceId || "",
  );
  const [copied, setCopied] = useState(false);
  const selectedModel = models.find(
    (m) => m.slug === selectedModelId || m.name === selectedModelId,
  ) ||
    models[0] || { name: "Unknown", icon: "chat" };

  useEffect(() => {
    setEditedText(initialEditedText);
    setEditedTitle(title);
    setEditedTags(initialTags);
    setSelectedWorkspaceId(initialWorkspaceId || "");
  }, [initialEditedText, title, initialTags, initialWorkspaceId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleApply = () => {
    if (onSave)
      onSave(
        editedTitle,
        editedText,
        selectedCategory,
        editedTags,
        selectedWorkspaceId || null,
      );
  };

  const handleDiscard = () => {
    if (onDiscard) onDiscard();
  };

  const baseContainerClass =
    "flex-1 w-full max-w-[1000px] mx-auto px-4 sm:px-6 flex flex-col gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500";
  const finalContainerClass = className
    ? `${baseContainerClass} ${className}`
    : `${baseContainerClass} pt-4 pb-12`;

  return (
    <div className={finalContainerClass}>
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={() => {
            if (onDiscard) onDiscard();
            else router.back();
          }}
          className="text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-xl border border-white/5 active:scale-95 flex items-center justify-center shrink-0"
        >
          <ArrowLeft className="size-6" />
        </button>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-3">
            Prompt Editor
            {isLoading && (
              <Loader2 className="animate-spin text-cyan-400 size-6" />
            )}
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Refine, edit, and optimize your generated prompt.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Editor Section */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <GlassPanel className="p-6 md:p-8 flex flex-col gap-4 relative overflow-hidden group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-primary/20 rounded-2xl blur opacity-50 transition-opacity duration-500 group-hover:opacity-75" />

            <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4 mb-2">
              <div className="flex items-center gap-3">
                <div className="bg-cyan-500/20 p-2 rounded-xl text-cyan-400 border border-cyan-500/30">
                  <Sparkles className="size-5" />
                </div>
                <div className="flex-1">
                  <input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    disabled={isLoading}
                    placeholder="Prompt Title"
                    className="w-full text-white font-bold tracking-tight text-lg bg-transparent border-none p-0 focus:outline-none focus:ring-0 placeholder:text-slate-500/50"
                  />
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Ready for your AI model
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className={`p-2 rounded-lg transition-all ${copied ? "text-emerald-400" : "text-slate-400 hover:text-cyan-400 hover:bg-white/5"}`}
                  title={copied ? "Copied!" : "Copy to clipboard"}
                >
                  {copied ? (
                    <Check className="size-5" />
                  ) : (
                    <Copy className="size-5" />
                  )}
                </button>
              </div>
            </div>

            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              disabled={isLoading}
              className="relative z-10 w-full h-[300px] md:h-[400px] bg-black/40 border border-white/10 rounded-xl p-5 text-slate-200 text-sm md:text-base leading-relaxed focus:outline-none focus:ring-1 focus:ring-cyan-500/50 resize-none font-sans code-preview transition-all"
              placeholder="Your refined prompt will appear here..."
            />
          </GlassPanel>

          {target?.output_type === "image" && target?.output && (
            <GlassPanel className="p-6 flex flex-col gap-4 relative overflow-hidden group">
              <div className="flex items-center gap-2">
                <div className="bg-cyan-500/20 p-2 rounded-xl text-cyan-400 border border-cyan-500/30">
                  <ImageIcon className="size-5" />
                </div>
                <span className="text-white font-semibold text-base">
                  Generated Image
                </span>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-lg bg-white/5">
                <img
                  src={target?.output ?? null}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center gap-4 text-slate-400 text-sm">
                {target.aspect_ratio && (
                  <span className="px-2 py-1 bg-white/5 rounded border border-white/10">
                    Aspect: {target.aspect_ratio}
                  </span>
                )}
                {target.negative_prompt && (
                  <span className="px-2 py-1 bg-white/5 rounded border border-white/10 max-w-xs truncate">
                    Negative: {target.negative_prompt}
                  </span>
                )}
              </div>
            </GlassPanel>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-end">
            <button
              onClick={handleDiscard}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/10 text-slate-300 font-bold text-sm hover:bg-white/5 transition-all active:scale-95"
            >
              Discard Changes
            </button>

            {/* Download Button — visible to all, gated for free plan */}
            <button
              onClick={() => onDownload?.(editedText, editedTitle)}
              disabled={isLoading}
              title={
                canDownload
                  ? "Download prompt"
                  : "Upgrade to Basic or higher plans to download"
              }
              className={`relative w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${
                canDownload
                  ? "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                  : "bg-white/5 border border-white/10 text-slate-500 cursor-pointer hover:border-amber-500/30 hover:text-amber-400/80"
              }`}
            >
              <Download className="size-4" />
              Download
              {!canDownload && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center size-4 rounded-full bg-amber-500 border border-black">
                  <Lock className="size-2.5 text-black" />
                </span>
              )}
            </button>

            <button
              onClick={handleApply}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-primary text-white font-bold text-sm shadow-neon hover:shadow-neon-strong transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
            >
              <Save className="size-5" />
              Save Prompt
            </button>
          </div>
        </div>

        {/* Sidebar Data */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Only Author Sees Raw Intent */}
          {isAuthor && (
            <GlassPanel className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-purple-500/20 p-1.5 rounded-lg text-purple-400 shrink-0">
                  <Lock className="size-5" />
                </div>
                <span className="text-sm font-bold text-white uppercase tracking-wide">
                  Raw Intent
                </span>
              </div>
              <div className="p-4 bg-black/30 rounded-lg border border-white/5">
                <p className="text-slate-400 text-sm italic font-medium leading-relaxed overflow-y-auto h-40">
                  "{initialRawIntent || "Loading intent..."}"
                </p>
              </div>
              <p className="text-[10px] text-slate-500 mt-3 text-center uppercase tracking-widest font-bold">
                Author Only View
              </p>
            </GlassPanel>
          )}

          {/* Metadata Panel */}
          <GlassPanel className="p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-4">
              Metadata
            </h3>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-slate-400 text-sm">Target Engine</span>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg">
                  {(() => {
                    const Icon = ICON_MAP[selectedModel.icon];
                    return Icon ? (
                      <Icon className="size-4 text-cyan-400" />
                    ) : null;
                  })()}
                  <span className="text-xs text-white font-medium">
                    {selectedModel.name}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-slate-400 text-sm">Category</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  disabled={isLoading}
                  className="text-xs bg-[#101922] text-slate-300 px-2.5 py-1 rounded-lg border border-white/10 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-slate-400 text-sm">Workspace</span>
                <select
                  value={selectedWorkspaceId}
                  onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                  disabled={isLoading}
                  className="text-xs bg-[#101922] text-slate-300 px-2.5 py-1 rounded-lg border border-white/10 focus:outline-none focus:border-cyan-500/50 cursor-pointer max-w-[150px]"
                >
                  <option value="">None (Personal)</option>
                  {(availableWorkspaces || []).map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}{" "}
                      {w.visibility === "community" ? "(Community)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-slate-400 text-sm">Tags</span>
                <input
                  type="text"
                  value={editedTags}
                  onChange={(e) => setEditedTags(e.target.value)}
                  disabled={isLoading}
                  placeholder="e.g. Code, Web"
                  className="w-32 text-xs bg-[#101922] text-slate-300 px-2.5 py-1 rounded-lg border border-white/10 focus:outline-none focus:border-cyan-500/50 text-right"
                />
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-slate-400 text-sm">Visibility</span>
                <button
                  onClick={() => onVisibilityChange?.(!isPublic)}
                  disabled={isLoading}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border transition-all ${
                    isPublic
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                  } hover:scale-105 active:scale-95 cursor-pointer`}
                >
                  {isPublic ? (
                    <>
                      <Globe className="size-4" />
                      <span className="text-xs font-medium uppercase tracking-tight">
                        Public
                      </span>
                    </>
                  ) : (
                    <>
                      <Lock className="size-4" />
                      <span className="text-xs font-medium uppercase tracking-tight">
                        Private
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
