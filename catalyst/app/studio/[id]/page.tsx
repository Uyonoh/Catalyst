"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import GlassPanel from "../../components/GlassPanel";
import { MODELS } from "../../components/studio/ModelSelector";
// Optional: import supabase if you want to fetch

export default function PromptViewEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  // Mock State - replacing with actual fetched dat or context data in the future
  const [editedText, setEditedText] = useState("");
  const [rawIntent, setRawIntent] = useState("");
  const [isAuthor, setIsAuthor] = useState(true); // Default to true to show author view, handle RLS/auth securely later
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [isLoading, setIsLoading] = useState(true);

  // In a real app we would load from Supabase using `id`
  useEffect(() => {
    // Simulated fetch
    setTimeout(() => {
      setEditedText("Design a modern, minimalist website for a boutique coffee shop. Include sections for a menu with 'single-origin' categories, a history section about 'farm-to-cup' sourcing, and a booking system for coffee tasting events. The aesthetic should be cozy but professional, using earthy tones and high-quality photography.");
      setRawIntent("make a website for a coffee shop");
      setIsLoading(false);
    }, 500);
  }, [id]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedText);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleApply = () => {
    // Save or just return to the main studio logic
    router.push("/studio");
  };

  const handleDiscard = () => {
    router.push("/studio");
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 w-full max-w-[1000px] mx-auto pt-16 pb-12 px-4 sm:px-6 flex flex-col gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={() => router.back()}
              className="text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-xl border border-white/5 active:scale-95"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-3">
                Prompt Editor
                {isLoading && (
                   <span className="material-symbols-outlined animate-spin-slow text-cyan-400 text-2xl">progress_activity</span>
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
                      <span className="material-symbols-outlined text-xl">
                        auto_awesome
                      </span>
                    </div>
                    <div>
                      <h2 className="text-white font-bold tracking-tight text-lg">Refined Output</h2>
                      <p className="text-xs text-slate-400 font-medium">Ready for your AI model</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleCopy}
                      className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-white/5 rounded-lg transition-all"
                      title="Copy to clipboard"
                    >
                      <span className="material-symbols-outlined text-xl">content_copy</span>
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
                  <span className="material-symbols-outlined">save</span>
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
                    <div className="bg-purple-500/20 p-1.5 rounded-lg text-purple-400">
                      <span className="material-symbols-outlined text-lg">lock</span>
                    </div>
                    <span className="text-sm font-bold text-white uppercase tracking-wide">Raw Intent</span>
                  </div>
                  <div className="p-4 bg-black/30 rounded-lg border border-white/5">
                    <p className="text-slate-400 text-sm italic font-medium leading-relaxed">
                      "{rawIntent || 'Loading intent...'}"
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
                      <span className="material-symbols-outlined text-[14px] text-cyan-400">
                        {selectedModel.icon}
                      </span>
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
                      <span className="material-symbols-outlined text-[16px] text-slate-500">public</span>
                      <span className="text-xs text-slate-300 font-medium">Private</span>
                    </div>
                  </div>
                </div>
              </GlassPanel>
              
            </div>

          </div>
        </main>

        <Footer />
      </div>

    </>
  );
}
