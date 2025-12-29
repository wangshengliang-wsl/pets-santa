import { db } from "@/db";
import { creditBalance, creditTransaction, payment } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export class CreditService {
  /**
   * 获取用户积分余额
   */
  static async getBalance(userId: string): Promise<number> {
    const result = await db
      .select()
      .from(creditBalance)
      .where(eq(creditBalance.userId, userId))
      .limit(1);

    if (result.length === 0) {
      // 创建新的积分记录
      await db.insert(creditBalance).values({
        id: nanoid(),
        userId,
        balance: 0,
        totalEarned: 0,
        totalSpent: 0,
      });
      return 0;
    }

    return result[0].balance;
  }

  /**
   * 获取用户积分详情
   */
  static async getBalanceDetails(userId: string) {
    const result = await db
      .select()
      .from(creditBalance)
      .where(eq(creditBalance.userId, userId))
      .limit(1);

    if (result.length === 0) {
      // 创建新的积分记录
      const newRecord = {
        id: nanoid(),
        userId,
        balance: 0,
        totalEarned: 0,
        totalSpent: 0,
      };
      await db.insert(creditBalance).values(newRecord);
      return newRecord;
    }

    return result[0];
  }

  /**
   * 添加积分（购买时调用）
   */
  static async addCredits(
    userId: string,
    amount: number,
    description: string,
    referenceId?: string
  ): Promise<void> {
    // 获取当前余额
    const currentBalance = await this.getBalance(userId);
    const newBalance = currentBalance + amount;

    // 更新余额
    await db
      .update(creditBalance)
      .set({
        balance: newBalance,
        totalEarned: creditBalance.totalEarned,
      })
      .where(eq(creditBalance.userId, userId));

    // 使用原始 SQL 更新 totalEarned
    await db.execute(
      `UPDATE credit_balance SET total_earned = total_earned + ${amount} WHERE user_id = '${userId}'`
    );

    // 记录交易
    await db.insert(creditTransaction).values({
      id: nanoid(),
      userId,
      type: "purchase",
      amount,
      balanceAfter: newBalance,
      description,
      referenceId,
    });
  }

  /**
   * 消费积分（生成图片时调用）
   */
  static async useCredits(
    userId: string,
    amount: number,
    description: string,
    referenceId?: string
  ): Promise<boolean> {
    const currentBalance = await this.getBalance(userId);

    if (currentBalance < amount) {
      return false; // 余额不足
    }

    const newBalance = currentBalance - amount;

    // 更新余额
    await db
      .update(creditBalance)
      .set({
        balance: newBalance,
      })
      .where(eq(creditBalance.userId, userId));

    // 使用原始 SQL 更新 totalSpent
    await db.execute(
      `UPDATE credit_balance SET total_spent = total_spent + ${amount} WHERE user_id = '${userId}'`
    );

    // 记录交易
    await db.insert(creditTransaction).values({
      id: nanoid(),
      userId,
      type: "usage",
      amount: -amount,
      balanceAfter: newBalance,
      description,
      referenceId,
    });

    return true;
  }

  /**
   * 获取用户交易记录
   */
  static async getTransactions(userId: string, limit = 20) {
    return db
      .select()
      .from(creditTransaction)
      .where(eq(creditTransaction.userId, userId))
      .orderBy(creditTransaction.createdAt)
      .limit(limit);
  }

  /**
   * 获取用户支付记录
   */
  static async getPayments(userId: string, limit = 20) {
    return db
      .select()
      .from(payment)
      .where(eq(payment.userId, userId))
      .orderBy(payment.createdAt)
      .limit(limit);
  }

  /**
   * 创建支付记录
   */
  static async createPayment(data: {
    userId: string;
    stripeSessionId: string;
    amount: number;
    currency?: string;
    status: string;
    creditsGranted: number;
    description?: string;
  }) {
    return db.insert(payment).values({
      id: nanoid(),
      ...data,
      currency: data.currency || "usd",
    });
  }

  /**
   * 更新支付状态
   */
  static async updatePaymentStatus(
    stripeSessionId: string,
    status: string,
    stripePaymentIntentId?: string
  ) {
    return db
      .update(payment)
      .set({
        status,
        stripePaymentIntentId,
      })
      .where(eq(payment.stripeSessionId, stripeSessionId));
  }

  /**
   * 根据 Stripe Session ID 获取支付记录
   */
  static async getPaymentBySessionId(stripeSessionId: string) {
    const result = await db
      .select()
      .from(payment)
      .where(eq(payment.stripeSessionId, stripeSessionId))
      .limit(1);

    return result[0] || null;
  }
}

