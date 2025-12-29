import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { CreditService } from "@/lib/services/credit-service";

export async function GET() {
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

    const userId = session.user.id;

    // 获取积分详情
    const creditDetails = await CreditService.getBalanceDetails(userId);

    // 获取支付记录
    const payments = await CreditService.getPayments(userId, 50);

    // 获取积分交易记录
    const transactions = await CreditService.getTransactions(userId, 50);

    return NextResponse.json({
      credits: {
        balance: creditDetails.balance,
        totalEarned: creditDetails.totalEarned,
        totalSpent: creditDetails.totalSpent,
      },
      payments: payments.map((p) => ({
        id: p.id,
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        creditsGranted: p.creditsGranted,
        description: p.description,
        createdAt: p.createdAt,
      })),
      transactions: transactions.map((t) => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        balanceAfter: t.balanceAfter,
        description: t.description,
        createdAt: t.createdAt,
      })),
    });
  } catch (error) {
    console.error("Billing API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch billing data" },
      { status: 500 }
    );
  }
}

