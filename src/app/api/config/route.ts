import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "",
    priceId: process.env.PRICE_ID || "",
  });
}

