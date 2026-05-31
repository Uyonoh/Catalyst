"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useParsing } from "../hooks/useParsing";
import { OptimizedPrompt } from "../lib/engine/types";
import { useUser } from "./AuthContext";
import { PromptControls } from "../lib/prompts/builder";
import {
  ModelMode,
  getDefaultMode,
  FALLBACK_MODELS,
} from "../lib/models-shared";

interface WorkspaceContextType {
  input: string;
  setInput: (text: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  selectedMode: ModelMode;
  setSelectedMode: (mode: ModelMode) => void;
  controls: PromptControls;
  setControls: (controls: Partial<PromptControls>) => void;
  result: OptimizedPrompt | null;
  isLoading: boolean;
  error: string | null;
  // LLM Parsing state
  parsedPrompt: string | null;
  parsedFormat: string | null;
  isGenerating: boolean;
  parseIntent: ({
    text,
    modelId,
    mode,
    controls,
  }: {
    text: string;
    modelId: string;
    mode?: ModelMode;
    controls?: PromptControls;
  }) => Promise<void>;
  generationError: string | null;
  retryCount: number;
  clearGenerationError: () => void;
  preferences: any;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined,
);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { profile, refreshProfile } = useUser();
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt");
  const [selectedMode, setSelectedMode] = useState<ModelMode>("text");
  const [controls, setControlsState] = useState<PromptControls>({
    creativity: 0.5,
    precision: 0.75,
    length: "short",
    outputFormat: "text",
    strategy: "zero_shot",
    failureHandling: true,
    tone: "neutral",
    negativePrompt: "",
  });

  const [hasInitializedControls, setHasInitializedControls] = useState(false);

  // Hydrate controls from user preferences once profile is loaded
  useEffect(() => {
    const userDefaults = profile?.preferences?.promptControls;
    if (userDefaults && !hasInitializedControls) {
      setControlsState((prev) => ({ ...prev, ...userDefaults }));
      setHasInitializedControls(true);
    }
  }, [profile, hasInitializedControls]);

  const setControls = (newControls: Partial<PromptControls>) => {
    setControlsState((prev) => ({ ...prev, ...newControls }));
  };

  // Auto-reset mode on model change
  useEffect(() => {
    const model = FALLBACK_MODELS.find((m: any) => m.slug === selectedModel);
    if (model) {
      setSelectedMode(getDefaultMode(model));
    }
  }, [selectedModel]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const guestInput = localStorage.getItem("catalyst_guest_input");
      if (guestInput) {
        setInput(guestInput);
        localStorage.removeItem("catalyst_guest_input");
      }
      const guestModel = localStorage.getItem("catalyst_guest_model");
      if (guestModel) {
        setSelectedModel(guestModel);
        localStorage.removeItem("catalyst_guest_model");
      }
    }
  }, []);

  const preferences = profile?.preferences || {};

  // Use preference for autoAnalyze or default to False
  const autoAnalyze = preferences.autoAnalyze ?? false;
  // If autoAnalyze is false, we might want to tell useParsing not to run automatically,
  // but useParsing currently might not accept preferences. For now we pass input and selectedModel.
  const { result, isLoading, error } = useParsing(
    autoAnalyze ? input : "",
    selectedModel,
  );

  // LLM Parsing state
  const [parsedPrompt, setParsedPrompt] = useState<string | null>(null);
  const [parsedFormat, setParsedFormat] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const clearGenerationError = () => {
    setGenerationError(null);
    setRetryCount(0);
  };

  const parseIntent = async ({
    text,
    modelId: model,
    mode: overrideMode,
    controls: overrideControls,
  }: {
    text: string;
    modelId: string;
    mode?: ModelMode;
    controls?: PromptControls;
  }) => {
    if (!text.trim()) return;

    setIsGenerating(true);
    setParsedPrompt(null);
    setParsedFormat(null);
    setGenerationError(null);
    setRetryCount(0);

    const activeControls = overrideControls || controls;
    const activeMode = overrideMode || selectedMode;
    const maxRetries = 3;
    let attempt = 0;

    const executeRequest = async (): Promise<boolean> => {
      try {
        const response = await fetch("/api/parse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            model,
            controls: activeControls,
            mode: activeMode,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData.error || "Failed to generate prompt";

          if (response.status === 402) {
            setGenerationError(errorMessage);
            return false;
          }

          throw new Error(errorMessage);
        }

        const data = await response.json();
        setParsedPrompt(data.refinedPrompt);
        setParsedFormat(data.format || null);
        if (refreshProfile) refreshProfile();
        return true;
      } catch (err: any) {
        console.error(`Attempt ${attempt + 1} failed:`, err);
        if (attempt < maxRetries) {
          attempt++;
          setRetryCount(attempt);
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          await new Promise((resolve) => setTimeout(resolve, delay));
          return executeRequest();
        }
        setGenerationError(
          err.message ||
            "Failed to generate prompt after several attempts. Please try again later.",
        );
        return false;
      }
    };

    try {
      await executeRequest();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        input,
        setInput,
        selectedModel,
        setSelectedModel,
        selectedMode,
        setSelectedMode,
        controls,
        setControls,
        result,
        isLoading,
        error,
        parsedPrompt,
        parsedFormat,
        isGenerating,
        parseIntent,
        generationError,
        retryCount,
        clearGenerationError,
        preferences,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
