import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { KieAIService } from "@/lib/services/kie-ai-service";

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

    // 获取用户的生成历史
    const creations = await KieAIService.getUserCreations(userId);

    // 格式化返回数据
    const formattedCreations = creations.map((task) => ({
      id: task.id,
      status: task.status,
      style: task.style,
      originalImageUrl: task.originalImageUrl,
      resultImageUrl: task.resultImageUrl,
      createdAt: task.createdAt,
      completedAt: task.completedAt,
    }));

    return NextResponse.json({
      creations: formattedCreations,
    });
  } catch (error) {
    console.error("Failed to fetch creations:", error);
    return NextResponse.json(
      { error: "Failed to fetch creations" },
      { status: 500 }
    );
  }
}

