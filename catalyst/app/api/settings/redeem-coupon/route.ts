import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user || authError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code } = await req.json();

    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json(
        { error: "Promo code is required" },
        { status: 400 }
      );
    }

    // Call Supabase RPC function to redeem the coupon
    const { data: result, error: rpcError } = await supabase.rpc("redeem_coupon", {
      p_user_id: user.id,
      p_code: code.trim(),
    });

    if (rpcError) {
      console.error("RPC Error redeeming coupon:", rpcError);
      return NextResponse.json(
        { error: rpcError.message || "Failed to redeem coupon" },
        { status: 500 }
      );
    }

    if (!result || !result.ok) {
      const errorCode = result?.error || "failed_redemption";
      let status = 400;
      let message = "Failed to redeem coupon";

      if (errorCode === "invalid_code") {
        message = "Invalid promo code. Please check and try again.";
      } else if (errorCode === "coupon_inactive") {
        message = "This promo code is no longer active.";
      } else if (errorCode === "coupon_depleted") {
        message = "This promo code has reached its maximum usage limit.";
      } else if (errorCode === "already_redeemed") {
        message = "You have already redeemed this promo code.";
      }

      return NextResponse.json({ error: message, code: errorCode }, { status });
    }

    return NextResponse.json({
      success: true,
      amount: result.amount,
      expiresAt: result.expires_at,
      couponCode: result.coupon_code,
    });
  } catch (err: any) {
    console.error("Error in redeem-coupon API route:", err);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
