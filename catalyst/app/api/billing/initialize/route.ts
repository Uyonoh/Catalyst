import { createClient } from "../../../lib/supabase-server";
import { NextResponse } from "next/server";
import { initializeTransaction } from "../../../lib/paystack";

export async function POST(request: Request) {
  const supabase = await createClient();
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const plans: Record<string, string | null | undefined> = {
      "free": null,
      "basic": process.env.NEXT_PUBLIC_PAYSTACK_PLAN_BASIC,
      "plus": process.env.NEXT_PUBLIC_PAYSTACK_PLAN_PLUS,
      "pro": process.env.NEXT_PUBLIC_PAYSTACK_PLAN_PRO,
      "ultra": process.env.NEXT_PUBLIC_PAYSTACK_PLAN_ULTRA,
    };

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { tier, currency, amount, baseAmount } = await request.json();

    if (!tier || !(tier in plans)) {
      console.error("Invalid tier: ", tier);
      return NextResponse.json({ message: "Invalid subscription tier" }, { status: 400 });
    }

    const metadata = JSON.stringify({
      tier: tier,
      userEmail: user.email,
      billingCurrency: currency,
      baseAmount: baseAmount, // Amount in USD
    });

    // Build the dynamic callback URL (redirecting back to settings after success)
    const origin = request.headers.get("origin") || "http://localhost:3000";
    const callbackUrl = `${origin}/settings/subscriptions?session=success`;

    const planCode = plans[tier];

    // Initialize Paystack transaction with the dynamic amount
    const paystackSession = await initializeTransaction(
      user.email!,
      currency,
      amount, 
      callbackUrl,
      metadata,
      planCode || undefined,
    );

    if (!paystackSession.status) {
      console.error("Payment status error: ", paystackSession.message);
      return NextResponse.json(
        { message: "Failed to initialize checkout." },
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
