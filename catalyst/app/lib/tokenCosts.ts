import { createClient } from "./supabase-server";
import {
  getFallbackCost as getFallbackCostFromTokens,
  TOKEN_COST_MATRIX,
  OUTPUT_GENERATION_MODES,
  OutputGenerationMode,
  DEFAULT_MODE_COSTS,
  getDefaultCostForMode,
} from "./tokens";

export {
  TOKEN_COST_MATRIX,
  OUTPUT_GENERATION_MODES,
  DEFAULT_MODE_COSTS,
  getDefaultCostForMode,
};
export type { OutputGenerationMode };

/**
 * Token cost record structure from the database
 */
export interface TokenCostRecord {
  model_slug: string;
  mode: string;
  cost: number;
}

/**
 * Result of token consumption check
 */
export interface TokenConsumptionResult {
  ok: boolean;
  remaining?: number;
  limit?: number;
  resets_at?: string;
  error?: string;
}

/**
/**
 * Fetches token cost from the public.token_costs table following the exact flow:
 * 1. Get from DB for (model_slug, mode)
 * 2. Fallback matrix if not found in DB
 * 3. Any model cost (from DB, then from matrix)
 * 4. Default cost for the mode
 *
 * @param modelSlug - The model slug (e.g., 'gpt', 'claude', 'dalle')
 * @param mode - The mode (e.g., 'text-generation', 'image-generation', 'video-generation', 'text', 'image', 'video')
 * @returns Promise resolving to the token cost as a number
 */
export async function getTokenCostFromDB(
  modelSlug: string,
  mode: string,
): Promise<number> {
  const aliasMap: Record<string, string> = {
    "text-generation": "text",
    "image-generation": "image",
    "video-generation": "video",
    text: "text-generation",
    image: "image-generation",
    video: "video-generation",
  };
  const altMode = aliasMap[mode];

  try {
    const supabase = await createClient();

    // 1. Get from DB: Specific mode or its alias
    const { data, error } = await supabase
      .from("token_costs")
      .select("cost")
      .eq("model_slug", modelSlug)
      .eq("mode", mode)
      .maybeSingle();

    if (error) {
      console.warn(
        `Failed to fetch token cost for ${modelSlug}/${mode} from DB:`,
        error.message,
      );
    } else if (data && data.cost !== null && data.cost !== undefined) {
      return data.cost;
    }

    if (altMode) {
      const { data: altData } = await supabase
        .from("token_costs")
        .select("cost")
        .eq("model_slug", modelSlug)
        .eq("mode", altMode)
        .maybeSingle();

      if (altData && altData.cost !== null && altData.cost !== undefined) {
        return altData.cost;
      }
    }

    // 2. Fallback matrix if not found in DB
    const modelMatrix = TOKEN_COST_MATRIX[modelSlug];
    if (modelMatrix) {
      const matrixCost = modelMatrix[mode];
      if (matrixCost !== undefined) {
        return matrixCost;
      }
      if (altMode && modelMatrix[altMode] !== undefined) {
        return modelMatrix[altMode];
      }
    }

    // 3. Any model cost: First from DB, then from matrix
    const { data: modelData, error: modelError } = await supabase
      .from("token_costs")
      .select("cost")
      .eq("model_slug", modelSlug)
      .order("cost", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (modelError) {
      console.warn(
        `Failed to fetch any token cost for ${modelSlug} from DB:`,
        modelError.message,
      );
    } else if (
      modelData &&
      modelData.cost !== null &&
      modelData.cost !== undefined
    ) {
      return modelData.cost;
    }

    if (modelMatrix) {
      const anyMatrixCost = Object.values(modelMatrix)[0];
      if (anyMatrixCost !== undefined) {
        return anyMatrixCost;
      }
    }

    // 4. Default cost for mode
    return getDefaultCostForMode(mode);
  } catch (err) {
    // If DB connection fails, proceed with matrix -> any model cost -> default cost
    console.error(
      `Unexpected error fetching token cost for ${modelSlug}/${mode}:`,
      err,
    );
    return getFallbackCost(modelSlug, mode);
  }
}

/**
 * Re-exports getFallbackCost from tokens.ts for convenience.
 * Follows the flow: fallback matrix -> any model cost -> default cost.
 *
 * @param modelSlug - The model slug
 * @param mode - The mode
 * @returns The token cost from the matrix, any model cost, or default mode cost
 */
export function getFallbackCost(modelSlug: string, mode: string): number {
  return getFallbackCostFromTokens(modelSlug, mode);
}

/**
 * Local token check fallback when RPC fails
 */
async function localTokenCheck(
  supabase: any,
  userId: string,
  tokenCost: number,
): Promise<TokenConsumptionResult> {
  try {
    // Get user's subscription
    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .select("plan_id, current_period_end")
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    if (subError || !subscription) {
      return {
        ok: false,
        error: "No active subscription",
        remaining: 0,
        limit: 0,
      };
    }

    // Get current usage
    const today = new Date().toISOString().split("T")[0];
    const { data: usage, error: usageError } = await supabase
      .from("usage")
      .select("token_count")
      .eq("user_id", userId)
      .eq("date", today)
      .maybeSingle();

    const limit = parseInt(subscription.plan_id);
    const used = usage?.token_count || 0;
    const remaining = limit - (used + tokenCost);

    return {
      ok: remaining >= 0,
      remaining: remaining,
      limit: limit,
      resets_at: subscription.current_period_end,
    };
  } catch (err) {
    console.error("Local token check failed:", err);
    return {
      ok: false,
      error: "Token check failed",
      remaining: 0,
      limit: 0,
    };
  }
}

/**
 * Consumes tokens for a user, querying public.token_costs table first.
 * Falls back to TOKEN_COST_MATRIX when DB connection fails.
 *
 * @param supabase - Supabase client
 * @param userId - User ID
 * @param modelSlug - Model slug
 * @param mode - Mode
 * @param apiEndpoint - API endpoint for usage tracking
 * @returns Promise resolving to token consumption result
 */
export async function consumeTokens(
  supabase: any,
  userId: string,
  modelSlug: string,
  mode: string,
  apiEndpoint: string = "/api/parse",
): Promise<TokenConsumptionResult> {
  try {
    // First, get the token cost using our resolution flow (DB -> matrix -> any model -> default cost)
    const tokenCost = await getTokenCostFromDB(modelSlug, mode);

    // Call the RPC to consume tokens, passing p_cost so DB deducts the exact resolved cost
    let tokenResult: any;
    let rpcError: any;

    const resWithCost = await supabase.rpc("consume_tokens", {
      p_user_id: userId,
      p_model: modelSlug,
      p_mode: mode,
      p_cost: tokenCost,
    });

    if (
      resWithCost.error &&
      (resWithCost.error.message?.includes("function") ||
        resWithCost.error.code === "PGRST202")
    ) {
      // Fallback if Postgres RPC function does not yet accept p_cost parameter
      const resWithoutCost = await supabase.rpc("consume_tokens", {
        p_user_id: userId,
        p_model: modelSlug,
        p_mode: mode,
      });
      tokenResult = resWithoutCost.data;
      rpcError = resWithoutCost.error;
    } else {
      tokenResult = resWithCost.data;
      rpcError = resWithCost.error;
    }

    if (rpcError) {
      console.error("Token consumption RPC error:", rpcError);
      // If RPC fails, check quota via localTokenCheck
      return await localTokenCheck(supabase, userId, tokenCost);
    }

    return tokenResult;
  } catch (err) {
    console.error("Token consumption error:", err);
    return {
      ok: false,
      error: "Token check failed",
      remaining: 0,
      limit: 0,
    };
  }
}

/**
 * Refunds tokens for a user
 */
export async function refundTokens(
  supabase: any,
  userId: string,
  modelSlug: string,
  mode: string,
  apiEndpoint: string = "/api/parse",
): Promise<void> {
  try {
    const tokenCost = await getTokenCostFromDB(modelSlug, mode);

    const resWithCost = await supabase.rpc("refund_tokens", {
      p_user_id: userId,
      p_model: modelSlug,
      p_mode: mode,
      p_cost: tokenCost,
    });

    if (
      resWithCost.error &&
      (resWithCost.error.message?.includes("function") ||
        resWithCost.error.code === "PGRST202")
    ) {
      const { error } = await supabase.rpc("refund_tokens", {
        p_user_id: userId,
        p_model: modelSlug,
        p_mode: mode,
      });

      if (error) {
        console.error("Failed to refund tokens:", error);
      }
    } else if (resWithCost.error) {
      console.error("Failed to refund tokens:", resWithCost.error);
    }
  } catch (err) {
    console.error("Refund tokens error:", err);
  }
}

/**
 * Batch fetch token costs for multiple model/mode pairs from the DB.
 * More efficient than calling getTokenCostFromDB multiple times.
 *
 * @param pairs - Array of {modelSlug, mode} pairs
 * @returns Promise resolving to Record<`${modelSlug}:${mode}`, number>
 */
export async function getBatchTokenCosts(
  pairs: Array<{ modelSlug: string; mode: string }>,
): Promise<Record<string, number>> {
  try {
    const supabase = await createClient();

    // Fetch all matching records in one query
    const { data, error } = await supabase
      .from("token_costs")
      .select("model_slug, mode, cost")
      .in(
        "model_slug",
        pairs.map((p) => p.modelSlug),
      );

    if (error) {
      console.warn(`Batch token cost fetch failed:`, error.message);
      // Fall back to individual lookups (which will use TOKEN_COST_MATRIX)
      const result: Record<string, number> = {};
      for (const pair of pairs) {
        const key = `${pair.modelSlug}:${pair.mode}`;
        result[key] = getFallbackCost(pair.modelSlug, pair.mode);
      }
      return result;
    }

    // Build a map from the DB results
    const dbCosts: Record<string, number> = {};
    const dbModelAnyCosts: Record<string, number> = {};
    if (data && Array.isArray(data)) {
      for (const record of data) {
        const key = `${record.model_slug}:${record.mode}`;
        dbCosts[key] = record.cost;
        if (dbModelAnyCosts[record.model_slug] === undefined) {
          dbModelAnyCosts[record.model_slug] = record.cost;
        }
      }
    }

    const aliasMap: Record<string, string> = {
      "text-generation": "text",
      "image-generation": "image",
      "video-generation": "video",
      text: "text-generation",
      image: "image-generation",
      video: "video-generation",
    };

    // Resolve costs following: DB -> Fallback matrix -> Any model cost -> Default cost
    const result: Record<string, number> = {};
    for (const pair of pairs) {
      const key = `${pair.modelSlug}:${pair.mode}`;
      const altMode = aliasMap[pair.mode];
      const altKey = altMode ? `${pair.modelSlug}:${altMode}` : null;

      // 1. Get from DB
      if (dbCosts[key] !== undefined) {
        result[key] = dbCosts[key];
        continue;
      }
      if (altKey && dbCosts[altKey] !== undefined) {
        result[key] = dbCosts[altKey];
        continue;
      }

      // 2. Fallback matrix if not found in DB
      const modelMatrix = TOKEN_COST_MATRIX[pair.modelSlug];
      if (modelMatrix && modelMatrix[pair.mode] !== undefined) {
        result[key] = modelMatrix[pair.mode];
        continue;
      }
      if (modelMatrix && altMode && modelMatrix[altMode] !== undefined) {
        result[key] = modelMatrix[altMode];
        continue;
      }

      // 3. Any model cost (DB first, then matrix)
      if (dbModelAnyCosts[pair.modelSlug] !== undefined) {
        result[key] = dbModelAnyCosts[pair.modelSlug];
        continue;
      }
      if (modelMatrix) {
        const anyCost = Object.values(modelMatrix)[0];
        if (anyCost !== undefined) {
          result[key] = anyCost;
          continue;
        }
      }

      // 4. Default cost for mode
      result[key] = getDefaultCostForMode(pair.mode);
    }

    return result;
  } catch (err) {
    console.error(`Unexpected error in batch token cost fetch:`, err);
    // Fall back using the resolution flow for all
    const result: Record<string, number> = {};
    for (const pair of pairs) {
      const key = `${pair.modelSlug}:${pair.mode}`;
      result[key] = getFallbackCost(pair.modelSlug, pair.mode);
    }
    return result;
  }
}
