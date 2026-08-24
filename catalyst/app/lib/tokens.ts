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

/**
 * Gets the fallback token cost from TOKEN_COST_MATRIX.
 * Returns 2 as the ultimate fallback if model or mode is not found.
 * 
 * @param modelSlug - The model slug
 * @param mode - The mode
 * @returns The token cost from the matrix, or 2 as default
 */
export function getFallbackCost(modelSlug: string, mode: string): number {
  const modelCosts = TOKEN_COST_MATRIX[modelSlug];
  if (modelCosts) {
    const modeCost = modelCosts[mode];
    if (modeCost !== undefined) {
      return modeCost;
    }
    // If mode not found for this model, try to find any mode for the model
    const firstMode = Object.values(modelCosts)[0];
    if (firstMode !== undefined) {
      return firstMode;
    }
  }
  // Ultimate fallback
  return 2;
}

/** Token cost matrix — mirrors public.token_costs DB table, used as fallback.
 *  The authoritative cost comes from public.token_costs table.
 *  When DB connection fails, this matrix serves as the fallback.
 */
export const TOKEN_COST_MATRIX: Record<string, Record<string, number>> = {
  gpt:             { text: 2, vision: 3, image: 5, audio: 4, code: 2 },
  claude:          { text: 2, vision: 3, code: 2 },
  gemini:          { text: 2, vision: 3, image: 5, video: 10, audio: 4, code: 2 },
  llama:           { text: 1, code: 1 },
  grok:            { text: 2, vision: 3, code: 2 },
  dalle:           { image: 5 },
  stablediffusion: { image: 4 },
  midjourney:      { image: 5 },
  veo:             { video: 10 },
};

/** Returns the UI-preview cost for a given model+mode pairing (falls back to 2).
 * This is a synchronous fallback function used on the client side.
 * For server-side operations, use getTokenCostFromDB() from ./tokenCosts which
 * queries public.token_costs table first with fallback to this matrix.
 */
export function getPreviewCost(modelSlug: string, mode: string): number {
  return TOKEN_COST_MATRIX[modelSlug]?.[mode] ?? 2;
}
