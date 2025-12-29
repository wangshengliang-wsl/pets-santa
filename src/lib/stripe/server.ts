import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-12-15.clover",
  typescript: true,
});

// 价格配置
export const PRICING = {
  CREDITS_PACK: {
    priceId: process.env.PRICE_ID!,
    amount: 2000, // $20.00 in cents
    credits: 200,
    name: "Holiday Pack",
    description: "200 Credits for AI Pet Portraits",
  },
};

