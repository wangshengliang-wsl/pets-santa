import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { KieAIService } from "@/lib/services/kie-ai-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
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

    const { taskId } = await params;

    // 获取本地任务
    const task = await KieAIService.getTask(taskId);

    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    // 验证任务属于当前用户
    if (task.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // 如果任务已经完成或失败，直接返回
    if (task.status === "success" || task.status === "failed") {
      return NextResponse.json({
        taskId: task.id,
        status: task.status,
        resultImageUrl: task.resultImageUrl,
        errorMessage: task.errorMessage,
        style: task.style,
        originalImageUrl: task.originalImageUrl,
        createdAt: task.createdAt,
        completedAt: task.completedAt,
      });
    }

    // 查询 Kie.AI 任务状态
    if (task.kieTaskId) {
      try {
        const kieStatus = await KieAIService.getTaskStatus(task.kieTaskId);

        // 根据 Kie.AI 状态更新本地任务
        if (kieStatus.state === "success" && kieStatus.resultUrl) {
          // 下载并保存图片到我们的存储
          const resultImageUrl = await KieAIService.saveResultImage(kieStatus.resultUrl);
          
          await KieAIService.updateTaskStatus(task.id, "success", {
            kieResultUrl: kieStatus.resultUrl,
            resultImageUrl,
          });

          return NextResponse.json({
            taskId: task.id,
            status: "success",
            resultImageUrl,
            style: task.style,
            originalImageUrl: task.originalImageUrl,
            createdAt: task.createdAt,
            completedAt: new Date(),
          });
        } else if (kieStatus.state === "fail") {
          await KieAIService.updateTaskStatus(task.id, "failed", {
            errorMessage: kieStatus.errorMessage || "Generation failed",
          });

          return NextResponse.json({
            taskId: task.id,
            status: "failed",
            errorMessage: kieStatus.errorMessage || "Generation failed",
            style: task.style,
            originalImageUrl: task.originalImageUrl,
            createdAt: task.createdAt,
            completedAt: new Date(),
          });
        } else {
          // 还在处理中
          if (task.status === "pending") {
            await KieAIService.updateTaskStatus(task.id, "processing");
          }

          return NextResponse.json({
            taskId: task.id,
            status: "processing",
            style: task.style,
            originalImageUrl: task.originalImageUrl,
            createdAt: task.createdAt,
          });
        }
      } catch (error) {
        console.error("Failed to query Kie.AI status:", error);
        // 继续返回当前状态
      }
    }

    return NextResponse.json({
      taskId: task.id,
      status: task.status,
      style: task.style,
      originalImageUrl: task.originalImageUrl,
      createdAt: task.createdAt,
    });
  } catch (error) {
    console.error("Task status error:", error);
    return NextResponse.json(
      { error: "Failed to get task status" },
      { status: 500 }
    );
  }
}

