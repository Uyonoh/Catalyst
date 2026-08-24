import { NextRequest, NextResponse } from "next/server";
import { getTokenCostFromDB } from "@/app/lib/tokenCosts";

/**
 * API endpoint to fetch token cost for a model+mode pair.
 * Queries public.token_costs table first, falls back to TOKEN_COST_MATRIX.
 * Used by client components that need to display preview costs.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
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
    // Fallback to default if something goes wrong
    return NextResponse.json({ cost: 2 });
  }
}
