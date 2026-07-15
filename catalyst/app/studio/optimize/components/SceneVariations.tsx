"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, Play } from "lucide-react";
import { useImageGenerate } from "../hooks/useImageGenerate";
import { useWorkspace } from "../../../context/WorkspaceContext";

interface SceneVariationsProps {
  baseAssembledPrompt: string;
  shotTypePhrase: string;
  aspectRatio: string;
}

const ANGLE_MODIFIERS = [
  { label: "Wide Establishing", phrase: "wide establishing shot" },
  { label: "Extreme Close-Up", phrase: "extreme close-up" },
  { label: "Low-Angle Heroic", phrase: "low-angle heroic shot" },
  { label: "Over-the-Shoulder", phrase: "over-the-shoulder shot" },
];

export default function SceneVariations({
  baseAssembledPrompt,
  shotTypePhrase,
  aspectRatio,
}: SceneVariationsProps) {
  const [hasStarted, setHasStarted] = useState(false);

  // Set up four separate generator instances to process concurrently
  const gen1 = useImageGenerate();
  const gen2 = useImageGenerate();
  const gen3 = useImageGenerate();
  const gen4 = useImageGenerate();

  const generators = [gen1, gen2, gen3, gen4];

   const {
     selectedModel: selectedModelId,
     setSelectedModel: setSelectedModelId,
   } = useWorkspace();

  const handleGenerateVariants = () => {
    if (!baseAssembledPrompt || baseAssembledPrompt.trim() === "") return;
    setHasStarted(true);

    ANGLE_MODIFIERS.forEach((modifier, index) => {
      // Logic: substitute the existing shot-type phrase with that modifier,
      // or prepend the modifier to the beginning of the prompt.
      let variantPrompt = baseAssembledPrompt;
      const targetPhrase = shotTypePhrase.trim();

      if (targetPhrase && baseAssembledPrompt.toLowerCase().includes(targetPhrase.toLowerCase())) {
        // Replace target phrase with modifier
        const regex = new RegExp(targetPhrase, "gi");
        variantPrompt = baseAssembledPrompt.replace(regex, modifier.phrase);
      } else {
        // Prepend it if no specific shot type was flagged
        variantPrompt = `${modifier.phrase}, ${baseAssembledPrompt}`;
      }

      generators[index].generate(selectedModelId, variantPrompt, "", aspectRatio);
    });
  };

  const isAnyLoading = generators.some((g) => g.status === "loading");

  return (
    <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Scene Variations
          </span>
          <span className="text-[11px] text-slate-500">
            Generate 4 alternate framings of this scene simultaneously.
          </span>
        </div>

        <button
          onClick={handleGenerateVariants}
          disabled={isAnyLoading || !baseAssembledPrompt}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-cyan-400 bg-cyan-950/20 hover:bg-cyan-950/40 border border-cyan-800/40 rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isAnyLoading ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              Rendering...
            </>
          ) : (
            <>
              <Play className="size-3.5" />
              Generate Variations
            </>
          )}
        </button>
      </div>

      {hasStarted && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ANGLE_MODIFIERS.map((mod, index) => {
            const gen = generators[index];
            return (
              <div
                key={mod.label}
                className="relative rounded-xl border border-white/10 bg-black/40 overflow-hidden flex flex-col items-center justify-center min-h-[140px] p-2"
              >
                {/* Title Overlay */}
                <div className="absolute top-2 left-2 z-10 bg-black/75 backdrop-blur-xs px-2 py-0.5 rounded text-[9px] text-slate-300 font-bold uppercase tracking-wider border border-white/5">
                  {mod.label}
                </div>

                {/* State Renders */}
                {gen.status === "loading" && (
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 className="size-4 animate-spin text-cyan-400 mb-1" />
                    <span className="text-[9px] text-cyan-400/80 animate-pulse uppercase tracking-widest font-bold">
                      Rendering
                    </span>
                  </div>
                )}

                {gen.status === "error" && (
                  <span className="text-[10px] text-rose-400 text-center font-semibold p-1">
                    Failed
                  </span>
                )}

                {gen.status === "success" && gen.result && (
                  <img
                    src={gen.result.url}
                    alt={mod.label}
                    className="w-full h-full min-h-[120px] object-cover rounded-lg"
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
