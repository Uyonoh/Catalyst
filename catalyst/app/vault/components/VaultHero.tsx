import React from "react";

export default function VaultHero() {
  return (
    <div className="flex flex-col gap-2 mb-8">
      <h2 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-2">
        Catalytic Vault
      </h2>
      <p className="text-slate-400 text-lg max-w-2xl">
        Manage, optimize, and deploy your library of saved AI prompts. Your
        creative arsenal, organized.
      </p>
    </div>
  );
}
