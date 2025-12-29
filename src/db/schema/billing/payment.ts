import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "../auth/user";

export const payment = pgTable("payment", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  stripeSessionId: text("stripe_session_id").unique(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  amount: integer("amount").notNull(), // 金额（美分）
  currency: text("currency").default("usd").notNull(),
  status: text("status").notNull(), // pending, completed, failed, refunded
  creditsGranted: integer("credits_granted").notNull().default(0),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type PaymentType = typeof payment.$inferSelect;
export type NewPaymentType = typeof payment.$inferInsert;

