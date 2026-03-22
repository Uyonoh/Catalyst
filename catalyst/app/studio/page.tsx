"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RawIntentPanel from "../components/studio/RawIntentPanel";
import LiveAnalysisPanel from "../components/studio/LiveAnalysisPanel";
import OptimizationSettings from "../components/studio/OptimizationSettings";
import { WorkspaceProvider } from "../context/WorkspaceContext";

export default function StudioPage() {
  const [showAnalysis, setShowAnalysis] = useState(false);
  // tracks if the panel is currently in the middle of a show/hide transition
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleToggle = () => {
    setIsTransitioning(true);
    setShowAnalysis((prev) => !prev);
  };

  return (
    <WorkspaceProvider>
      {/* Background gradient blurs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 w-full max-w-[1100px] mx-auto pt-16 pb-12 px-4 sm:px-6 flex flex-col gap-6 md:gap-8">
          {/* <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-6 md:py-8 flex flex-col gap-6 md:gap-8"> */}
          {/* <main className="flex-1 w-full max-w-[1200px] mx-auto pt-16 pb-12 px-4 md:px-8 relative z-10"> */}
          {/* ── Page Header ──────────────────────────────────── */}
          <section className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                Prompt Studio
              </h1>
              <p className="text-slate-400 text-base md:text-lg">
                Transform your raw ideas into optimized prompts with live
                analysis.
              </p>
            </div>

            {/* Analysis panel visibility toggle */}
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
              <span
                className="material-symbols-outlined text-[20px] transition-transform duration-300"
                style={{
                  transform: showAnalysis ? "scale(1)" : "scale(0.9)",
                }}
              >
                {showAnalysis ? "visibility" : "visibility_off"}
              </span>
              <span className="hidden sm:inline whitespace-nowrap">
                {showAnalysis ? "Hide Analysis" : "Show Analysis"}
              </span>
            </button>
          </section>

          {/* ── Main Workspace ───────────────────────────────── */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0 w-full">
              <RawIntentPanel />
            </div>

            {/* 
                The 'hidden' class (display: none) is only applied AFTER the transition 
                to ensure the slide/fade animations can be seen.
            */}
            <div
              onTransitionEnd={(e) => {
                // Ensure we only trigger once per full transition cycle
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
              {/* Inner wrapper prevents text wrapping as parent's max-width goes to 0 */}
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

        <Footer />
      </div>

      <div className="fixed bottom-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-900/50 to-transparent pointer-events-none" />
    </WorkspaceProvider>
  );
}
