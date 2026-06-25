import { createClient } from "../../../lib/supabase-server";
import { NextResponse } from "next/server";
import { initializeTransaction } from "../../../lib/paystack";

export async function POST(request: Request) {
  const supabase = await createClient();
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const plans = {
      "free": null,
      "basic": process.env.NEXT_PUBLIC_PAYSTACK_PLAN_BASIC,
      "plus": process.env.NEXT_PUBLIC_PAYSTACK_PLAN_PLUS,
      "pro": process.env.NEXT_PUBLIC_PAYSTACK_PLAN_PRO,
      "ultra": process.env.NEXT_PUBLIC_PAYSTACK_PLAN_ULTRA,
    };

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { tier } = await request.json();

    if (!tier || !(tier in plans)) {
      return NextResponse.json({ message: "Invalid subscription tier" }, { status: 400 });
    }

    // Retrieve plan code from environment variables
    const planCode = plans[tier];

    if (!planCode) {
      return NextResponse.json(
        { message: `Paystack Plan Code for ${tier} is not configured on the server.` },
        { status: 500 }
      );
    }

    // Build the dynamic callback URL (redirecting back to settings after success)
    const origin = request.headers.get("origin") || "http://localhost:3000";
    const callbackUrl = `${origin}/settings/subscriptions?session=success`;

    // Initialize Paystack transaction with the chosen plan
    // Amount is 0 because recurring plans determine the amount in their setup, 
    // but Paystack requires a base payload
    const paystackSession = await initializeTransaction(
      user.email!,
      0, 
      callbackUrl,
      planCode
    );

    if (!paystackSession.status) {
      return NextResponse.json(
        { message: paystackSession.message || "Failed to initialize Paystack checkout." },
        { status: 400 }
      );
    }

    return NextResponse.json({ url: paystackSession.data.authorization_url });
  } catch (err: any) {
    console.error("Initialize transaction error:", err);
    return NextResponse.json(
      { message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
