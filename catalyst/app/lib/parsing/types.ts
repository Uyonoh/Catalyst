export type EntityType =
  | "subject"
  | "style"
  | "modifier"
  | "atmosphere"
  | "lighting"
  | "persona"
  | "instruction";

export interface Entity {
  label: string;
  type: EntityType;
  value: string;
  startIndex?: number;
  endIndex?: number;
}

export interface ParsingResult {
  intentClarity: number; // 0 to 1
  intent: string;
  entities: Entity[];
  targetModel?:
    | "gpt"
    | "claude"
    | "gemini"
    | "llama"
    | "grok"
    | "dalle"
    | "stablediffusion"
    | "midjourney"
    | "veo";
  suggestedFormat?: "json" | "markdown" | "natural_language";
  raw?: any;
}

export interface ParsingStrategy {
  name: string;
  analyze(text: string): Promise<ParsingResult> | ParsingResult;
}
