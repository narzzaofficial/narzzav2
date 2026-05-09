import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiRequest } from "@/lib/auth";
import { runNewsPipeline } from "@/lib/pipeline/pipeline-runner";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(_req: NextRequest) {
  const authError = await requireAdminApiRequest();
  if (authError) return authError;

  try {
    const result = await runNewsPipeline();
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("[admin/auto-generate] Pipeline error:", error);
    return NextResponse.json({ error: "Pipeline gagal" }, { status: 500 });
  }
}
