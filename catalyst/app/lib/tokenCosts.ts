import { createClient } from "./supabase-server";
import { getFallbackCost as getFallbackCostFromTokens } from "./tokens";

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
 * Fetches token cost from the public.token_costs table.
 * Falls back to TOKEN_COST_MATRIX if DB query fails or returns no result.
 * 
 * @param modelSlug - The model slug (e.g., 'gpt', 'claude', 'dalle')
 * @param mode - The mode (e.g., 'text', 'image', 'video', 'vision')
 * @returns Promise resolving to the token cost as a number
 */
export async function getTokenCostFromDB(modelSlug: string, mode: string): Promise<number> {
  try {
    const supabase = await createClient();
    
    // Try to fetch from public.token_costs table (without .single() to avoid coercion error)
    const { data, error } = await supabase
      .from("token_costs")
      .select("cost")
      .eq("model_slug", modelSlug)
      .eq("mode", mode)
      .maybeSingle();

    if (error) {
      console.warn(`Failed to fetch token cost for ${modelSlug}/${mode} from DB:`, error.message);
    } else if (data && data.cost !== null && data.cost !== undefined) {
      return data.cost;
    }

    // If no record found for specific mode, try to get any cost for the model
    const { data: modelData, error: modelError } = await supabase
      .from("token_costs")
      .select("cost")
      .eq("model_slug", modelSlug)
      .order("cost", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (modelError) {
      console.warn(`Failed to fetch any token cost for ${modelSlug} from DB:`, modelError.message);
    } else if (modelData && modelData.cost !== null && modelData.cost !== undefined) {
      return modelData.cost;
    }

    // Fall back to the hardcoded matrix
    return getFallbackCost(modelSlug, mode);
  } catch (err) {
    // If there's any unexpected error (e.g., DB connection failed), use fallback
    console.error(`Unexpected error fetching token cost for ${modelSlug}/${mode}:`, err);
    return getFallbackCost(modelSlug, mode);
  }
}

/**
 * Re-exports getFallbackCost from tokens.ts for convenience.
 * Gets the fallback token cost from TOKEN_COST_MATRIX.
 * Returns 2 as the ultimate fallback if model or mode is not found.
 * 
 * @param modelSlug - The model slug
 * @param mode - The mode
 * @returns The token cost from the matrix, or 2 as default
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
  tokenCost: number
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
        limit: 0
      };
    }

    // Get current usage
    const today = new Date().toISOString().split('T')[0];
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
      resets_at: subscription.current_period_end
    };
  } catch (err) {
    console.error("Local token check failed:", err);
    return {
      ok: false,
      error: "Token check failed",
      remaining: 0,
      limit: 0
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
  apiEndpoint: string = '/api/parse'
): Promise<TokenConsumptionResult> {
  try {
    // First, get the token cost using our fallback logic
    const tokenCost = await getTokenCostFromDB(modelSlug, mode);

    // Now call the RPC to consume tokens
    const { data: tokenResult, error: rpcError } = await supabase.rpc(
      "consume_tokens",
      { p_user_id: userId, p_model: modelSlug, p_mode: mode }
    );

    if (rpcError) {
      console.error("Token consumption RPC error:", rpcError);
      // If RPC fails, we can't track usage, but we can still check if user has quota
      // by falling back to a local check
      return await localTokenCheck(supabase, userId, tokenCost);
    }

    return tokenResult;
  } catch (err) {
    console.error("Token consumption error:", err);
    // If everything fails, use fallback cost and assume no quota
    return {
      ok: false,
      error: "Token check failed",
      remaining: 0,
      limit: 0
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
  apiEndpoint: string = '/api/parse'
): Promise<void> {
  try {
    const { error } = await supabase.rpc('refund_tokens', {
      p_user_id: userId,
      p_model: modelSlug,
      p_mode: mode
    });

    if (error) {
      console.error("Failed to refund tokens:", error);
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
export async function getBatchTokenCosts(pairs: Array<{ modelSlug: string; mode: string }>): Promise<Record<string, number>> {
  try {
    const supabase = await createClient();
    
    // Fetch all matching records in one query
    const { data, error } = await supabase
      .from("token_costs")
      .select("model_slug, mode, cost")
      .in(
        "model_slug",
        pairs.map((p) => p.modelSlug)
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
    if (data && Array.isArray(data)) {
      for (const record of data) {
        const key = `${record.model_slug}:${record.mode}`;
        dbCosts[key] = record.cost;
      }
    }

    // Fill in any missing values with fallback costs
    const result: Record<string, number> = {};
    for (const pair of pairs) {
      const key = `${pair.modelSlug}:${pair.mode}`;
      if (dbCosts[key] !== undefined) {
        result[key] = dbCosts[key];
      } else {
        result[key] = getFallbackCost(pair.modelSlug, pair.mode);
      }
    }

    return result;
  } catch (err) {
    console.error(`Unexpected error in batch token cost fetch:`, err);
    // Fall back to TOKEN_COST_MATRIX for all
    const result: Record<string, number> = {};
    for (const pair of pairs) {
      const key = `${pair.modelSlug}:${pair.mode}`;
      result[key] = getFallbackCost(pair.modelSlug, pair.mode);
    }
    return result;
  }
}
