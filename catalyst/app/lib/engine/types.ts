/**
 * OMNI-PROMPT ENGINE - CORE TYPE DEFINITIONS
 * Version: 1.0.0
 */

export enum InputModality {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  CODE = "CODE",
  GEOSPATIAL = "GEOSPATIAL", // Specifically for GIS/Spatial data
}

export enum TargetModel {
  GPT_4O = "GPT_4O",
  CLAUDE_3_5_SONNET = "CLAUDE_3_5_SONNET",
  GEMINI_1_5_PRO = "GEMINI_1_5_PRO",
  LLAMA_3 = "LLAMA_3",
  GROK_1 = "GROK_1",
  DALLE_3 = "DALLE_3",
  STABLE_DIFFUSION_XL = "STABLE_DIFFUSION_XL",
  MIDJOURNEY_V6 = "MIDJOURNEY_V6",
  VEO_VIDEO = "VEO_VIDEO",
}

export enum Domain {
  TECHNICAL_BACKEND = "TECHNICAL_BACKEND",
  TECHNICAL_FRONTEND = "TECHNICAL_FRONTEND",
  TECHNICAL_GIS = "TECHNICAL_GIS",
  TECHNICAL_DEVOPS = "TECHNICAL_DEVOPS",
  CREATIVE_MOTION = "CREATIVE_MOTION",
  CREATIVE_COPY = "CREATIVE_COPY",
  CREATIVE_VISUAL = "CREATIVE_VISUAL",
  BUSINESS_STRATEGY = "BUSINESS_STRATEGY",
  GENERAL = "GENERAL",
}

export enum Intent {
  // Technical Intents
  DEBUG = "DEBUG",
  REFACTOR = "REFACTOR",
  ARCHITECT = "ARCHITECT",
  SPATIAL_ANALYSIS = "SPATIAL_ANALYSIS",
  DOCUMENT = "DOCUMENT",

  // Creative Intents
  STORYBOARD = "STORYBOARD",
  COLOR_GRADE = "COLOR_GRADE",
  COMPOSITION = "COMPOSITION",
  SCRIPTWRITING = "SCRIPTWRITING",
  STYLE_TRANSFER = "STYLE_TRANSFER",

  // General
  SUMMARIZE = "SUMMARIZE",
  EXPAND = "EXPAND",
  BRAINSTORM = "BRAINSTORM",
  GENERAL_TASK = "GENERAL_TASK",
}

export interface Asset {
  id: string;
  type: InputModality;
  uri: string; // Remote URL or Local Path
  mimeType: string;
  description?: string; // User-provided context for the asset
  metadata?: Record<string, any>; // EXIF, Resolution, Duration, etc.
}

export interface PromptConstraints {
  tone: "PROFESSIONAL" | "CONCISE" | "CREATIVE" | "ACADEMIC" | "ELI5";
  outputFormat: "MARKDOWN" | "JSON" | "CSV" | "YAML" | "PLAIN_TEXT";
  maxTokens?: number;
  temperature?: number; // 0.0 to 1.0
  negativeConstraints?: string[]; // e.g. ["no code", "no intro"]
}

/**
 * The Deconstructed Prompt Object
 * This is what the Analyzer produces and the Compiler consumes.
 */
export interface DeconstructedPrompt {
  originalInput: string;
  detectedDomain: Domain;
  primaryIntent: Intent;
  secondaryIntents: Intent[];
  confidenceScore: number; // 0.0 to 1.0
  assets: Asset[];
  constraints: PromptConstraints;
  variables: Record<string, string>; // Extracted placeholders like {{api_key}}
  persona?: string; // e.g. "Senior React Developer"
  style?: string; // e.g. "Step-by-step", "Chain of thought"
}

/**
 * The final output from the Compiler
 */
export interface OptimizedPrompt {
  model: TargetModel;
  formattedPrompt: string | object; // Object for multimodal parts (Gemini style)
  systemInstruction?: string;
  metadata: Partial<DeconstructedPrompt>;
}
