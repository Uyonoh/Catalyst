import { useState } from "react";

export type GenerateStatus = "idle" | "loading" | "success" | "error";

export interface GenerateResult {
  url: string;
  width: number;
  height: number;
  seed: number;
  prompt: string;
}

export function useImageGenerate() {
  const [status, setStatus] = useState<GenerateStatus>("idle");
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async (model: string, prompt: string, negativePrompt: string, aspectRatio: string) => {
    if (!prompt || prompt.trim() === "") {
      setError("Prompt / Subject is required to generate an image.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          prompt,
          negativePrompt,
          aspectRatio,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      setStatus("success");
      return data;
    } catch (err: any) {
      console.error("Image generation error:", err);
      setError(err.message || "Something went wrong during generation.");
      setStatus("error");
      return null;
    }
  };

  const clear = () => {
    setStatus("idle");
    setResult(null);
    setError(null);
  };

  return {
    status,
    result,
    error,
    generate,
    clear,
  };
}
