import { db } from "@/db";
import { generationTask } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { put } from "@vercel/blob";

const KIE_AI_BASE_URL = "https://api.kie.ai/api/v1";

// Kie.AI API 响应类型
interface KieCreateTaskResponse {
  code: number;
  msg: string;
  data: {
    taskId: string;
  };
}

interface KieTaskStatusResponse {
  code: number;
  msg: string;
  data: {
    taskId: string;
    model: string;
    state: "waiting" | "success" | "fail";
    param: string;
    resultJson: string | null;
    failCode: string | null;
    failMsg: string | null;
    costTime: number | null;
    completeTime: number | null;
    createTime: number;
  };
}

interface KieResultJson {
  resultUrls?: string[];
  resultObject?: Record<string, unknown>;
}

export class KieAIService {
  private static apiKey = process.env.KIE_AI_API_KEY;

  /**
   * 检查 API Key 是否配置
   */
  private static checkApiKey() {
    if (!this.apiKey) {
      throw new Error("KIE_AI_API_KEY is not configured");
    }
  }

  /**
   * 创建图片生成任务
   */
  static async createTask(params: {
    userId: string;
    imageUrl: string;
    prompt: string;
    style: string;
    aspectRatio?: string;
    resolution?: string;
  }): Promise<{ taskId: string; kieTaskId: string }> {
    this.checkApiKey();

    // 创建本地任务记录
    const taskId = nanoid();
    
    // 构建回调 URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const callbackUrl = baseUrl ? `${baseUrl}/api/callback` : undefined;

    // 调用 Kie.AI API 创建任务
    const response = await fetch(`${KIE_AI_BASE_URL}/jobs/createTask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: "nano-banana-pro",
        input: {
          prompt: params.prompt,
          image_input: [params.imageUrl],
          aspect_ratio: params.aspectRatio || "1:1",
          resolution: params.resolution || "1K",
          output_format: "png",
        },
        callBackUrl: callbackUrl,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Kie.AI API error:", response.status, errorText);
      throw new Error(`Kie.AI API error: ${response.status}`);
    }

    const result: KieCreateTaskResponse = await response.json();

    if (result.code !== 200) {
      throw new Error(result.msg || "Failed to create task");
    }

    // 保存任务到数据库
    await db.insert(generationTask).values({
      id: taskId,
      userId: params.userId,
      kieTaskId: result.data.taskId,
      status: "pending",
      style: params.style,
      prompt: params.prompt,
      originalImageUrl: params.imageUrl,
      creditsUsed: 20,
    });

    return {
      taskId,
      kieTaskId: result.data.taskId,
    };
  }

  /**
   * 查询任务状态
   */
  static async getTaskStatus(kieTaskId: string): Promise<{
    state: "waiting" | "success" | "fail";
    resultUrl?: string;
    errorMessage?: string;
  }> {
    this.checkApiKey();

    const response = await fetch(
      `${KIE_AI_BASE_URL}/jobs/recordInfo?taskId=${kieTaskId}`,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Kie.AI API error: ${response.status}`);
    }

    const result: KieTaskStatusResponse = await response.json();

    if (result.code !== 200) {
      throw new Error(result.msg || "Failed to get task status");
    }

    const { state, resultJson, failMsg } = result.data;

    let resultUrl: string | undefined;
    if (state === "success" && resultJson) {
      try {
        const parsed: KieResultJson = JSON.parse(resultJson);
        resultUrl = parsed.resultUrls?.[0];
      } catch (e) {
        console.error("Failed to parse resultJson:", e);
      }
    }

    return {
      state,
      resultUrl,
      errorMessage: failMsg || undefined,
    };
  }

  /**
   * 获取本地任务详情
   */
  static async getTask(taskId: string) {
    const result = await db
      .select()
      .from(generationTask)
      .where(eq(generationTask.id, taskId))
      .limit(1);

    return result[0] || null;
  }

  /**
   * 根据 Kie Task ID 获取本地任务
   */
  static async getTaskByKieTaskId(kieTaskId: string) {
    const result = await db
      .select()
      .from(generationTask)
      .where(eq(generationTask.kieTaskId, kieTaskId))
      .limit(1);

    return result[0] || null;
  }

  /**
   * 更新任务状态
   */
  static async updateTaskStatus(
    taskId: string,
    status: "pending" | "processing" | "success" | "failed",
    updates?: {
      kieResultUrl?: string;
      resultImageUrl?: string;
      errorMessage?: string;
    }
  ) {
    await db
      .update(generationTask)
      .set({
        status,
        ...updates,
        completedAt: status === "success" || status === "failed" ? new Date() : undefined,
      })
      .where(eq(generationTask.id, taskId));
  }

  /**
   * 下载图片并保存到 Vercel Blob
   */
  static async saveResultImage(kieResultUrl: string): Promise<string> {
    // 下载图片
    const response = await fetch(kieResultUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status}`);
    }

    const blob = await response.blob();

    // 生成文件名
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const filename = `generated/${timestamp}-${randomStr}.png`;

    // 上传到 Vercel Blob
    const result = await put(filename, blob, {
      access: "public",
      addRandomSuffix: false,
    });

    return result.url;
  }

  /**
   * 处理任务完成回调
   */
  static async handleCallback(kieTaskId: string, kieResultUrl: string) {
    const task = await this.getTaskByKieTaskId(kieTaskId);
    if (!task) {
      console.error("Task not found for kieTaskId:", kieTaskId);
      return;
    }

    try {
      // 下载并保存到我们的存储
      const resultImageUrl = await this.saveResultImage(kieResultUrl);

      // 更新任务状态
      await this.updateTaskStatus(task.id, "success", {
        kieResultUrl,
        resultImageUrl,
      });
    } catch (error) {
      console.error("Failed to save result image:", error);
      await this.updateTaskStatus(task.id, "failed", {
        kieResultUrl,
        errorMessage: "Failed to save result image",
      });
    }
  }

  /**
   * 获取用户的生成历史
   */
  static async getUserCreations(userId: string, limit = 50) {
    return db
      .select()
      .from(generationTask)
      .where(eq(generationTask.userId, userId))
      .orderBy(generationTask.createdAt)
      .limit(limit);
  }
}

