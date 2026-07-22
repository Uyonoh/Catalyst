export interface PromptControls {
  creativity: number;
  precision: number;
  length: "short" | "medium" | "long" | string;
  outputFormat: "text" | "json" | "yaml" | "markdown" | string;
  strategy: "zero_shot" | "few_shot" | "chain_of_thought" | string;
  failureHandling: boolean;
  tone: string;
  negativePrompt: string;
}

export interface OptimizedPrompt {
  model: string;
  formattedPrompt: string | Record<string, any>;
  systemInstruction?: string;
  metadata: {
    confidenceScore?: number;
    detectedDomain?: string;
    primaryIntent?: string;
    constraints?: {
      tone?: string;
      outputFormat?: string;
      [key: string]: any;
    };
    variables?: Record<string, any>;
    [key: string]: any;
  };
}
