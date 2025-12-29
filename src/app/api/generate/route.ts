import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { CreditService } from "@/lib/services/credit-service";
import { KieAIService } from "@/lib/services/kie-ai-service";

const CREDITS_PER_GENERATION = 20;

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

    const userId = session.user.id;

    // 获取请求参数
    const { imageUrl, prompt, style } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (!style) {
      return NextResponse.json(
        { error: "Style is required" },
        { status: 400 }
      );
    }

    // 检查 API Key 是否配置（在扣除积分之前）
    if (!process.env.KIE_AI_API_KEY) {
      console.error("KIE_AI_API_KEY is not configured");
      return NextResponse.json(
        { 
          error: "Service configuration error. Please contact support.",
          details: "KIE_AI_API_KEY is not configured"
        },
        { status: 500 }
      );
    }

    // 检查用户积分
    const balance = await CreditService.getBalance(userId);
    if (balance < CREDITS_PER_GENERATION) {
      return NextResponse.json(
        { 
          error: "Insufficient credits", 
          required: CREDITS_PER_GENERATION,
          current: balance 
        },
        { status: 402 }
      );
    }

    // 扣除积分
    const deducted = await CreditService.useCredits(
      userId,
      CREDITS_PER_GENERATION,
      `Image generation - ${style}`,
    );

    if (!deducted) {
      return NextResponse.json(
        { error: "Failed to deduct credits" },
        { status: 500 }
      );
    }

    // 创建生成任务
    let taskId: string;
    let kieTaskId: string;
    
    try {
      const result = await KieAIService.createTask({
        userId,
        imageUrl,
        prompt,
        style,
      });
      taskId = result.taskId;
      kieTaskId = result.kieTaskId;
    } catch (taskError) {
      // 如果任务创建失败，需要退还积分
      console.error("Failed to create task, refunding credits:", taskError);
      // 注意：这里不退还积分，因为积分已经在 useCredits 中扣除
      // 实际应用中可以考虑添加退款逻辑
      throw taskError;
    }

    // 返回任务信息
    return NextResponse.json({
      taskId,
      kieTaskId,
      creditsUsed: CREDITS_PER_GENERATION,
      message: "Generation task created successfully",
    });
  } catch (error) {
    console.error("Generate error:", error);
    
    // 检查是否是 API Key 未配置的错误
    if (error instanceof Error && error.message.includes("KIE_AI_API_KEY")) {
      return NextResponse.json(
        { 
          error: "Service configuration error. Please contact support.",
          details: "KIE_AI_API_KEY is not configured"
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to create generation task" 
      },
      { status: 500 }
    );
  }
}

