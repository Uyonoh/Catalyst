import { NextResponse } from "next/server";

export async function GET() {
  // Direct back to our contained subscriptions page for plan status management
  return NextResponse.json({ url: "/settings/subscriptions/pricing" });
}
