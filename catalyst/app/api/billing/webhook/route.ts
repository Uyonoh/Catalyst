import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

// Initialize Supabase Admin Client using service role key to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_DEFAULT_KEY!,
);

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const paystackSignature = request.headers.get("x-paystack-signature");

    if (!paystackSignature) {
      console.warn("[api/billing/webhook] - User request has invalid paystack signature");
      return NextResponse.json(
        { message: "Missing Paystack signature" },
        { status: 400 },
      );
    }

    // Verify HMAC-SHA512 Webhook Signature
    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET_KEY || "")
      .update(rawBody)
      .digest("hex");

    if (hash !== paystackSignature) {
      console.warn("[api/billing/webhook] - User request has invalid signature");
      return NextResponse.json(
        { message: "Invalid signature verification failed" },
        { status: 401 },
      );
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const data = payload.data;

    console.log(`Paystack Webhook Received Event: ${event}`);
    console.log("Webhook payload: ", payload);

    // Define subscription tier helper mapping
    const planPro = process.env.NEXT_PUBLIC_PAYSTACK_PLAN_PRO;
    const planEnterprise = process.env.NEXT_PUBLIC_PAYSTACK_PLAN_ENTERPRISE;

    const getTierFromPlanCode = (planCode: string) => {
      if (planCode === planPro) return "pro";
      if (planCode === planEnterprise) return "enterprise";
      return "free";
    };

    if (event === "subscription.create" || event === "subscription.enable") {
      const email = data.customer.email;
      const customerCode = data.customer.customer_code;
      const planCode = data.plan.plan_code;
      const nextPaymentDate = data.next_payment_date; // ISO format string
      const tier = getTierFromPlanCode(planCode);

      const { error } = await supabaseAdmin
        .from("profiles")
        .update({
          plan: tier,
          paystack_customer_code: customerCode,
          subscription_status: "active",
          plan_id: planCode,
          current_period_end: nextPaymentDate,
        })
        .eq("email", email);

      if (error) {
        console.error(
          "Database update error on subscription activation:",
          error,
        );
        return NextResponse.json(
          { message: "Database update error" },
          { status: 500 },
        );
      }

      console.log(`Successfully upgraded user ${email} to ${tier} tier.`);
    } else if (
      event === "subscription.disable" ||
      event === "invoice.payment_failed"
    ) {
      const email = data.customer.email;
      const customerCode = data.customer.customer_code;

      const { error } = await supabaseAdmin
        .from("profiles")
        .update({
          plan: "free",
          subscription_status:
            event === "subscription.disable" ? "canceled" : "past_due",
          current_period_end: new Date().toISOString(),
        })
        .eq("email", email);

      if (error) {
        console.error("Database update error on subscription change:", error);
        return NextResponse.json(
          { message: "Database update error" },
          { status: 500 },
        );
      }

      console.log(
        `User ${email} subscription canceled/past-due. Downgraded to free.`,
      );
    }

    return NextResponse.json(
      { message: "Webhook processed successfully" },
      { status: 200 },
    );
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return NextResponse.json(
      { message: err.message || "Internal server error" },
      { status: 500 },
    );
  }
}
