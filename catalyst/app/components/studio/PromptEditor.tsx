"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GlassPanel from "../GlassPanel";
import { MODELS } from "./ModelSelector";
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
  Palette
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
  selectedModelId?: string;
  onDiscard?: () => void;
  onSave?: (text: string) => void;
  isLoading?: boolean;
  className?: string;
}

export default function PromptEditor({
  title = "Refined Output",
  initialEditedText,
  initialRawIntent,
  isAuthor,
  selectedModelId,
  onDiscard,
  onSave,
  isLoading = false,
  className
}: PromptEditorProps) {
  const router = useRouter();
  const [editedText, setEditedText] = useState(initialEditedText);
  const [copied, setCopied] = useState(false);
  const selectedModel = MODELS.find(m => m.id === selectedModelId || m.name === selectedModelId) || MODELS[0];

  useEffect(() => {
    setEditedText(initialEditedText);
  }, [initialEditedText]);

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
    if (onSave) onSave(editedText);
  };

  const handleDiscard = () => {
    if (onDiscard) onDiscard();
  };

  const baseContainerClass = "flex-1 w-full max-w-[1000px] mx-auto px-4 sm:px-6 flex flex-col gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500";
  const finalContainerClass = className ? `${baseContainerClass} ${className}` : `${baseContainerClass} pt-4 pb-12`;

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
                <div>
                  <h2 className="text-white font-bold tracking-tight text-lg">{title}</h2>
                  <p className="text-xs text-slate-400 font-medium">Ready for your AI model</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleCopy}
                  className={`p-2 rounded-lg transition-all ${copied ? "text-emerald-400" : "text-slate-400 hover:text-cyan-400 hover:bg-white/5"}`}
                  title={copied ? "Copied!" : "Copy to clipboard"}
                >
                  {copied ? <Check className="size-5" /> : <Copy className="size-5" />}
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-end">
            <button
              onClick={handleDiscard}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/10 text-slate-300 font-bold text-sm hover:bg-white/5 transition-all active:scale-95"
            >
              Discard Changes
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
                <span className="text-sm font-bold text-white uppercase tracking-wide">Raw Intent</span>
              </div>
              <div className="p-4 bg-black/30 rounded-lg border border-white/5">
                <p className="text-slate-400 text-sm italic font-medium leading-relaxed overflow-hidden break-words text-ellipsis line-clamp-6">
                  "{initialRawIntent || 'Loading intent...'}"
                </p>
              </div>
              <p className="text-[10px] text-slate-500 mt-3 text-center uppercase tracking-widest font-bold">
                Author Only View
              </p>
            </GlassPanel>
          )}

          {/* Metadata Panel */}
          <GlassPanel className="p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-4">Metadata</h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-slate-400 text-sm">Target Engine</span>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg">
                  {(() => {
                    const Icon = ICON_MAP[selectedModel.icon];
                    return Icon ? <Icon className="size-4 text-cyan-400" /> : null;
                  })()}
                  <span className="text-xs text-white font-medium">{selectedModel.name}</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-slate-400 text-sm">Category</span>
                <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-medium">Text Gen</span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-slate-400 text-sm">Visibility</span>
                <div className="flex items-center gap-1.5">
                  <Globe className="size-4 text-slate-500" />
                  <span className="text-xs text-slate-300 font-medium">Private</span>
                </div>
              </div>
            </div>
          </GlassPanel>
          
        </div>

      </div>
    </div>
  );
}
