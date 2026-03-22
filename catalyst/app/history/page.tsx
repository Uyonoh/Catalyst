"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function HistoryPage() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
      </div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 w-full max-w-[1200px] mx-auto pt-24 pb-12 px-4 md:px-8">
          <div className="flex flex-col gap-2 mb-12 animate-fadeIn">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Prompt <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">History</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              Track and revisit all your previous prompt generations and optimizations.
            </p>
          </div>
          
          <div className="glass-panel p-12 rounded-3xl flex flex-col items-center justify-center text-center animate-slideUp">
            <div className="size-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-4xl text-slate-500">history</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No history found</h2>
            <p className="text-slate-500 mb-8 max-w-sm">
              You haven't generated any prompts yet. Head over to the Studio to get started.
            </p>
            <a 
              href="/studio" 
              className="px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl hover:bg-cyan-500/20 transition-all font-bold"
            >
              Go to Studio
            </a>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
