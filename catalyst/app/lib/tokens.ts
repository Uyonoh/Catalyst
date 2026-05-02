export const FREE_DAILY_LIMIT = 50;
export const PRO_DAILY_LIMIT = 200;

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

/** Token cost matrix — mirrors token_costs DB table, used for UI preview only.
 *  The authoritative cost is always resolved server-side from the DB.
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

/** Returns the UI-preview cost for a given model+mode pairing (falls back to 2). */
export function getPreviewCost(modelSlug: string, mode: string): number {
  return TOKEN_COST_MATRIX[modelSlug]?.[mode] ?? 2;
}
