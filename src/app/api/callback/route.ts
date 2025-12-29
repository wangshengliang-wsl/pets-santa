import { NextRequest, NextResponse } from "next/server";
import { KieAIService } from "@/lib/services/kie-ai-service";

// Kie.AI 回调数据结构（与 Query Task API 响应相同）
interface KieCallbackData {
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

export async function POST(request: NextRequest) {
  try {
    const body: KieCallbackData = await request.json();

    console.log("Kie.AI callback received:", JSON.stringify(body, null, 2));

    if (body.code !== 200) {
      console.error("Kie.AI callback error:", body.msg);
      return NextResponse.json(
        { error: "Invalid callback data" },
        { status: 400 }
      );
    }

    const { taskId: kieTaskId, state, resultJson, failMsg } = body.data;

    if (state === "success" && resultJson) {
      try {
        const parsed: KieResultJson = JSON.parse(resultJson);
        const resultUrl = parsed.resultUrls?.[0];

        if (resultUrl) {
          // 处理任务完成
          await KieAIService.handleCallback(kieTaskId, resultUrl);
          console.log(`Task ${kieTaskId} completed successfully`);
        } else {
          console.error("No result URL in callback");
        }
      } catch (parseError) {
        console.error("Failed to parse resultJson:", parseError);
      }
    } else if (state === "fail") {
      // 处理任务失败
      const task = await KieAIService.getTaskByKieTaskId(kieTaskId);
      if (task) {
        await KieAIService.updateTaskStatus(task.id, "failed", {
          errorMessage: failMsg || "Generation failed",
        });
        console.log(`Task ${kieTaskId} failed: ${failMsg}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Callback processing error:", error);
    return NextResponse.json(
      { error: "Failed to process callback" },
      { status: 500 }
    );
  }
}

