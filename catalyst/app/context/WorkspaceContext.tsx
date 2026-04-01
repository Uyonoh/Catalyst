"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useParsing } from "../hooks/useParsing";
import { OptimizedPrompt } from "../lib/engine/types";
import { useUser } from "./AuthContext";

interface WorkspaceContextType {
  input: string;
  setInput: (text: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  result: OptimizedPrompt | null;
  isLoading: boolean;
  error: string | null;
  // LLM Parsing state
  parsedPrompt: string | null;
  isGenerating: boolean;
  parseIntent: (text: string) => Promise<void>;
  preferences: any;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined,
);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt");
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const guestInput = localStorage.getItem("catalyst_guest_input");
      if (guestInput) {
        setInput(guestInput);
        localStorage.removeItem("catalyst_guest_input");
      }
    }
  }, []);
  
  const { profile } = useUser();
  const preferences = profile?.preferences || {};
  
  // Use preference for autoAnalyze or default to true
  const autoAnalyze = preferences.autoAnalyze ?? true;
  // If autoAnalyze is false, we might want to tell useParsing not to run automatically,
  // but useParsing currently might not accept preferences. For now we pass input and selectedModel.
  const { result, isLoading, error } = useParsing(autoAnalyze ? input : "", selectedModel);
  
  // LLM Parsing state
  const [parsedPrompt, setParsedPrompt] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const parseIntent = async (text: string) => {
    if (!text.trim()) return;
    
    setIsGenerating(true);
    setParsedPrompt(null);
    
    try {
      const response = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) throw new Error("Failed to generate prompt");
      
      const data = await response.json();
      setParsedPrompt(data.refinedPrompt);
    } catch (err) {
      console.error("Error parsing intent:", err);
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
        result,
        isLoading,
        error,
        parsedPrompt,
        isGenerating,
        parseIntent,
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
