import { createClient } from "../../../lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch user subscription details
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("paystack_subscription_code, paystack_email_token, plan")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ message: "User profile not found" }, { status: 404 });
    }

    const { paystack_subscription_code, paystack_email_token, plan } = profile;

    if (plan === "free" || !paystack_subscription_code) {
      return NextResponse.json({ message: "No active subscription to cancel" }, { status: 400 });
    }

    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
    if (!PAYSTACK_SECRET_KEY) {
      console.error("PAYSTACK_SECRET_KEY is not defined");
      return NextResponse.json({ message: "Billing service configuration error" }, { status: 500 });
    }

    // Call Paystack API to cancel subscription
    const response = await fetch("https://api.paystack.co/subscription/disable", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: paystack_subscription_code,
        token: paystack_email_token,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.status) {
      console.error("Paystack cancel subscription failed:", result);
      return NextResponse.json(
        { message: result.message || "Failed to cancel subscription on Paystack" },
        { status: 400 }
      );
    }

    // Update profile in DB to free
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        plan: "free",
        subscription_status: "canceled",
        paystack_subscription_code: null,
        paystack_email_token: null,
        current_period_end: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Database update error on cancellation:", updateError);
      return NextResponse.json({ message: "Database update error" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Subscription canceled successfully" });
  } catch (err: any) {
    console.error("Cancel subscription error:", err);
    return NextResponse.json(
      { message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
