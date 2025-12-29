import { NextRequest, NextResponse } from "next/server";
import { stripe, PRICING } from "@/lib/stripe/server";
import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { CreditService } from "@/lib/services/credit-service";

export async function POST(request: NextRequest) {
  try {
    // 验证用户登录状态
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Please login first" },
        { status: 401 }
      );
    }

    const { priceId } = await request.json();

    // 验证价格 ID
    if (priceId !== PRICING.CREDITS_PACK.priceId) {
      return NextResponse.json(
        { error: "Invalid price ID" },
        { status: 400 }
      );
    }

    // 获取 origin
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL;

    // 创建 Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=true`,
      customer_email: session.user.email,
      metadata: {
        userId: session.user.id,
        credits: PRICING.CREDITS_PACK.credits.toString(),
      },
      allow_promotion_codes: true,
    });

    // 创建待处理的支付记录
    await CreditService.createPayment({
      userId: session.user.id,
      stripeSessionId: checkoutSession.id,
      amount: PRICING.CREDITS_PACK.amount,
      status: "pending",
      creditsGranted: PRICING.CREDITS_PACK.credits,
      description: `Purchase ${PRICING.CREDITS_PACK.credits} credits`,
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

