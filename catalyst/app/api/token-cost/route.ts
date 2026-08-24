import { NextRequest, NextResponse } from "next/server";
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
      // Get all models from TOKEN_COST_MATRIX to know what to fetch
      const allModels: Array<{ modelSlug: string; mode: string }> = [];
      
      for (const [modelSlug, modes] of Object.entries(TOKEN_COST_MATRIX)) {
        for (const mode of Object.keys(modes)) {
          allModels.push({ modelSlug, mode });
        }
      }

      // Fetch all token costs from DB
      const tokenCosts: Record<string, number> = {};
      
      for (const pair of allModels) {
        const cost = await getTokenCostFromDB(pair.modelSlug, pair.mode);
        const key = `${pair.modelSlug}:${pair.mode}`;
        tokenCosts[key] = cost;
      }

      return NextResponse.json({ costs: tokenCosts });
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
