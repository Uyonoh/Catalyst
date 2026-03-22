import React from "react";

export default function VaultFeatured() {
  const featuredImage =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBAVsfsI1WFmkCuQZOSxSw5Rf07bYqbx7lHekw-arWybjAOc2nfPKoim5JXEy5Cp6X3m7dfQCerp9fGDnchx9hx7xh8-B6DMs-kCXIv1xJ0IB9xqmeOSnvW5-AcmNKZsirPCZFbNHQfSDnaUVuRzQXNMlaASTMkxcq0PH3VCOgs6WiQrPO6-mZN37WiZLGW5ZAUB2CcEJhJIsBjp63CaY5LZFonFhD_Qz3bB9aLbXzgK4Njr95gJcsqFGogBn7Rf0W1X9ZSuC3CCBc";

  return (
    <div className="relative w-full rounded-2xl overflow-hidden group min-h-[320px] md:h-[280px] shadow-2xl border border-white/10 mb-10">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url("${featuredImage}")` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#101922] via-[#101922]/60 to-transparent" />
      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex gap-2">
              <span className="px-2 py-1 rounded bg-primary/20 border border-primary/30 text-primary text-[10px] md:text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                Featured
              </span>
              <span className="px-2 py-1 rounded bg-white/10 border border-white/10 text-white text-[10px] md:text-xs font-medium backdrop-blur-md">
                GPT-4
              </span>
            </div>
            <h3 className="text-xl md:text-3xl font-bold text-white leading-tight">
              Complex Data Analysis & Visualization Assistant
            </h3>
            <p className="text-white/80 text-sm md:text-base line-clamp-2 md:line-clamp-1">
              A multi-step prompt designed to ingest CSV data and output Python
              matplotlib code.
            </p>
          </div>
          <button className="glass-panel hover:bg-primary hover:border-primary text-white h-10 md:h-12 px-5 md:px-6 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-300 shrink-0 w-full md:w-auto text-sm md:text-base hover:scale-[1.02] active:scale-[0.98] group/btn shadow-lg hover:shadow-primary/20">
            Open Prompt
            <span className="material-symbols-outlined text-sm md:text-base transition-transform duration-300 group-hover/btn:translate-x-1">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
