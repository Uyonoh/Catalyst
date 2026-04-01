import { NextResponse } from "next/server";

export async function GET() {
  // Stub for Stripe Billing Portal. 
  // Future implementation:
  // 1. Verify user session via supabase-server
  // 2. Lookup stripe_customer_id
  // 3. Generate stripe.billingPortal.sessions.create({ customer, return_url })
  // 4. Return the new portal URL
  
  return NextResponse.json({ url: "#" });
}
