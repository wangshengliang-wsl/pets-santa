import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "../auth/user";

// 用户积分余额表
export const creditBalance = pgTable("credit_balance", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .unique(),
  balance: integer("balance").notNull().default(0),
  totalEarned: integer("total_earned").notNull().default(0),
  totalSpent: integer("total_spent").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// 积分交易记录表
export const creditTransaction = pgTable("credit_transaction", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // purchase, usage, refund, bonus
  amount: integer("amount").notNull(), // 正数为增加，负数为消耗
  balanceAfter: integer("balance_after").notNull(), // 交易后余额
  description: text("description"),
  referenceId: text("reference_id"), // 关联的支付ID或其他引用
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CreditBalanceType = typeof creditBalance.$inferSelect;
export type NewCreditBalanceType = typeof creditBalance.$inferInsert;
export type CreditTransactionType = typeof creditTransaction.$inferSelect;
export type NewCreditTransactionType = typeof creditTransaction.$inferInsert;

