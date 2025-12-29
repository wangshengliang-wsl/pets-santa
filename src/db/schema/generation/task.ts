import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "../auth/user";

// 生成任务状态
export type TaskStatus = "pending" | "processing" | "success" | "failed";

// AI图片生成任务表
export const generationTask = pgTable("generation_task", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  kieTaskId: text("kie_task_id"),              // Kie.AI 返回的任务 ID
  status: text("status").notNull().$type<TaskStatus>(), // pending, processing, success, failed
  style: text("style").notNull(),               // 风格模板名称
  prompt: text("prompt").notNull(),             // 发送给 API 的完整 prompt
  originalImageUrl: text("original_image_url").notNull(), // 用户上传的原始图片 URL
  resultImageUrl: text("result_image_url"),     // 最终生成的图片 URL（存储在我们的 Blob 中）
  kieResultUrl: text("kie_result_url"),         // Kie.AI 返回的原始结果 URL
  creditsUsed: integer("credits_used").notNull().default(20), // 消耗的积分
  errorMessage: text("error_message"),          // 错误信息（失败时）
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),       // 完成时间
});

export type GenerationTaskType = typeof generationTask.$inferSelect;
export type NewGenerationTaskType = typeof generationTask.$inferInsert;

