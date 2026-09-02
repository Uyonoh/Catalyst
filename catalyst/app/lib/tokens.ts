export const FREE_MONTHLY_LIMIT = 50;

export const FREE_WEEKLY_LIMIT = 25;
export const BASIC_WEEKLY_LIMIT = 100;
export const PLUS_WEEKLY_LIMIT = 250;
export const PRO_WEEKLY_LIMIT = 500;

export const tierLimits: Record<string, number> = {
  "free": FREE_WEEKLY_LIMIT,
  "basic": BASIC_WEEKLY_LIMIT,
  "plus": PLUS_WEEKLY_LIMIT,
  "pro": PRO_WEEKLY_LIMIT,
  "ultra": 0,
};

export interface TokenCheckResult {
  ok: boolean;
  plan?: string;
  unlimited?: boolean;
  cost?: number;
  used?: number;
  limit?: number;
  remaining?: number;
  resets_at?: string;   // ISO date string e.g. "2026-05-03"
  error?: 'quota_exceeded' | 'profile_not_found' | string;
}

export const OUTPUT_GENERATION_MODES = [
  "video-generation",
  "image-generation",
  "text-generation",
] as const;

export type OutputGenerationMode = (typeof OUTPUT_GENERATION_MODES)[number];

export const DEFAULT_MODE_COSTS: Record<string, number> = {
  "video-generation": 10,
  "image-generation": 5,
  "text-generation": 2,
  video: 10,
  image: 5,
  text: 2,
  vision: 3,
  audio: 4,
  code: 2,
};

/**
 * Gets the default token cost for a given mode if not found in the DB.
 * 
 * @param mode - The mode (e.g. 'video-generation', 'image-generation', 'text-generation')
 * @returns Default cost for the mode, or 2 as ultimate fallback
 */
export function getDefaultCostForMode(mode: string): number {
  return DEFAULT_MODE_COSTS[mode] ?? 2;
}

/** Mode alias mappings for cross-compatibility */
const MODE_ALIASES: Record<string, string> = {
  "text-generation": "text",
  "image-generation": "image",
  "video-generation": "video",
  text: "text-generation",
  image: "image-generation",
  video: "video-generation",
};

/**
 * Gets the fallback token cost from TOKEN_COST_MATRIX or default mode cost.
 * Follows the flow: fallback matrix -> any model cost -> default cost.
 * 
 * @param modelSlug - The model slug
 * @param mode - The mode
 * @returns The token cost from the matrix, any model cost, or default cost for the mode
 */
export function getFallbackCost(modelSlug: string, mode: string): number {
  const modelCosts = TOKEN_COST_MATRIX[modelSlug];
  if (modelCosts) {
    // 1. Fallback matrix specific mode
    const modeCost = modelCosts[mode];
    if (modeCost !== undefined) {
      return modeCost;
    }
    const altMode = MODE_ALIASES[mode];
    if (altMode && modelCosts[altMode] !== undefined) {
      return modelCosts[altMode];
    }
    // 2. Any model cost
    const firstModeCost = Object.values(modelCosts)[0];
    if (firstModeCost !== undefined) {
      return firstModeCost;
    }
  }
  // 3. Default cost for mode
  return getDefaultCostForMode(mode);
}

/** Token cost matrix — mirrors public.token_costs DB table, used as fallback.
 *  The authoritative cost comes from public.token_costs table.
 *  When DB connection fails, this matrix serves as the fallback.
 */
export const TOKEN_COST_MATRIX: Record<string, Record<string, number>> = {
  gpt:             { text: 2, "text-generation": 2, vision: 3, image: 5, "image-generation": 5, audio: 4, code: 2 },
  claude:          { text: 2, "text-generation": 2, vision: 3, code: 2 },
  gemini:          { text: 2, "text-generation": 2, vision: 3, image: 5, "image-generation": 5, video: 10, "video-generation": 10, audio: 4, code: 2 },
  llama:           { text: 1, "text-generation": 1, code: 1 },
  grok:            { text: 2, "text-generation": 2, vision: 3, code: 2 },
  dalle:           { image: 5, "image-generation": 5 },
  stablediffusion: { image: 4, "image-generation": 4 },
  midjourney:      { image: 5, "image-generation": 5 },
  veo:             { video: 10, "video-generation": 10 },
};

/** Returns the UI-preview cost for a given model+mode pairing.
 * Follows the flow: fallback matrix -> any model cost -> default cost.
 */
export function getPreviewCost(modelSlug: string, mode: string): number {
  return getFallbackCost(modelSlug, mode);
}
