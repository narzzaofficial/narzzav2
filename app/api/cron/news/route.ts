import { NextRequest, NextResponse } from "next/server";
import { runNewsPipeline } from "@/lib/pipeline/pipeline-runner";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runNewsPipeline();
    console.log("[cron/news] Pipeline selesai:", result);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("[cron/news] Pipeline error:", error);
    return NextResponse.json({ error: "Pipeline gagal" }, { status: 500 });
  }
}
