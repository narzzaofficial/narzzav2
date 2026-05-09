import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiRequest } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { PipelineConfigModel, DEFAULT_PIPELINE_CONFIG } from "@/lib/models/PipelineConfig";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  const authError = await requireAdminApiRequest();
  if (authError) return authError;

  await connectDB();
  const config = await PipelineConfigModel.findOne({}).lean();
  return NextResponse.json(config ?? DEFAULT_PIPELINE_CONFIG);
}

export async function PUT(req: NextRequest) {
  const authError = await requireAdminApiRequest();
  if (authError) return authError;

  await connectDB();
  const body = await req.json();

  const updated = await PipelineConfigModel.findOneAndUpdate(
    {},
    {
      $set: {
        textModel: body.textModel,
        imageModel: body.imageModel,
        articlesPerRun: Number(body.articlesPerRun),
        sources: body.sources,
        updatedAt: Date.now(),
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();

  return NextResponse.json(updated);
}
