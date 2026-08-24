import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase-server";
import { getTokenCostFromDB, TOKEN_COST_MATRIX } from "@/app/lib/tokenCosts";

/**
 * API endpoint to fetch token costs.
 * - GET /api/token-cost?model=X&mode=Y - fetches single cost
 * - GET /api/token-cost/all - fetches all costs at once for caching
 * 
 * Queries public.token_costs table first, falls back to TOKEN_COST_MATRIX.
 * Used by client components that need to display preview costs.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Check if this is a request for all token costs
    if (searchParams.has('all') || searchParams.get('model') === 'all') {
      const supabase = await createClient();
      
      // Fetch the entire token_costs table in one query
      const { data, error } = await supabase
        .from("token_costs")
        .select("model_slug, mode, cost");

      if (error) {
        console.warn("Failed to fetch token costs from DB:", error.message);
        // Fall through to use TOKEN_COST_MATRIX fallback below
      } else {
        // Build the costs map from DB results
        const tokenCosts: Record<string, number> = {};
        if (data && Array.isArray(data)) {
          for (const record of data) {
            const key = `${record.model_slug}:${record.mode}`;
            tokenCosts[key] = record.cost;
          }
        }
        return NextResponse.json({ costs: tokenCosts });
      }
    }

    // Single model+mode request
    const modelSlug = searchParams.get('model');
    const mode = searchParams.get('mode');

    if (!modelSlug || !mode) {
      return NextResponse.json(
        { error: "Missing required query parameters: model and mode" },
        { status: 400 }
      );
    }

    const cost = await getTokenCostFromDB(modelSlug, mode);
    return NextResponse.json({ cost });
  } catch (error: any) {
    console.error("Error fetching token cost:", error);
    // For single request, return fallback
    const modelSlug = searchParams.get('model');
    const mode = searchParams.get('mode');
    
    if (modelSlug && mode) {
      // Try to get from TOKEN_COST_MATRIX as fallback
      const matrix = TOKEN_COST_MATRIX as Record<string, Record<string, number>>;
      const fallbackCost = matrix[modelSlug]?.[mode] ?? 2;
      return NextResponse.json({ cost: fallbackCost });
    }
    
    // For all request, return full TOKEN_COST_MATRIX as fallback
    const fallbackCosts: Record<string, number> = {};
    for (const [modelSlug, modes] of Object.entries(TOKEN_COST_MATRIX)) {
      for (const [mode, cost] of Object.entries(modes)) {
        fallbackCosts[`${modelSlug}:${mode}`] = cost;
      }
    }
    return NextResponse.json({ costs: fallbackCosts });
  }
}
