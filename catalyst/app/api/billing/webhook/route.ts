import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

// Initialize Supabase Admin Client using service role key to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_DEFAULT_KEY!,
);

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

interface PaymentMetadata {
  tier: string;
  userEmail: string;
  billingCurrency: string;
  baseAmount: number;
  referrer?: string;
};

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
    const meta: PaymentMetadata = data.metadata;

    // Validate data(.customer) against meta
    // Validate payment amount

    console.log(`Paystack Webhook Received Event: ${event}`);
    console.log("Webhook payload: ", payload);

    if (event === "charge.success") {
      const email = data.customer.email;
      const customerCode = data.customer.customer_code;
      const authCode = data.authorization?.authorization_code;
      const amount = data.amount;
      const currency = data.currency;
      const tier = meta.tier || "free";
      const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      const subscriptionCode = data.subscription?.subscription_code || null;
      const emailToken = data.subscription?.email_token || null;

      // Fetch user profile id for logging transactions
      const { data: profile, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("email", email)
        .single();

      if (profileError || !profile) {
        console.error("Failed to retrieve profile for transaction logging:", profileError);
      } else {
        // Insert transaction record
        const { error: txError } = await supabaseAdmin
          .from("transactions")
          .insert({
            user_id: profile.id,
            reference: data.reference,
            amount: amount,
            currency: currency,
            status: data.status || "success",
            plan_tier: tier,
            payment_method: data.channel || "card",
            paid_at: data.paid_at ? new Date(data.paid_at).toISOString() : new Date().toISOString(),
          });
        if (txError) {
          console.error("Database error on logging transaction:", txError);
        }
      }

      const { error } = await supabaseAdmin
        .from("profiles")
        .update({
          plan: tier,
          paystack_customer_code: customerCode,
          subscription_status: "active",
          paystack_authorization_code: authCode,
          billing_amount: amount,
          billing_currency: currency,
          current_period_end: periodEnd,
          paystack_subscription_code: subscriptionCode,
          paystack_email_token: emailToken,
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
