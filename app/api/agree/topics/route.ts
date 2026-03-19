import { NextRequest, NextResponse } from "next/server";

import {
  dbUnavailableResponse,
  logApiError,
  validationErrorResponse,
} from "@/lib/api-helpers";
import { makeSlug, normalizeString } from "@/lib/api/agree-crud";
import { revalidateAgreeCaches } from "@/lib/api/agree-helpers";
import { requireAdminApiRequest } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { AgreeTopicModel } from "@/lib/models/AgreeTopic";
import { createAgreeTopicSchema } from "@/lib/validation/agree";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const authError = await requireAdminApiRequest();
    if (authError) return authError;

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const items = await AgreeTopicModel.find({})
      .sort({ isActive: -1, name: 1 })
      .lean();

    return NextResponse.json({ items });
  } catch (error) {
    logApiError("GET /api/agree/topics error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authError = await requireAdminApiRequest();
    if (authError) return authError;

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const body = await req.json();
    const parsed = createAgreeTopicSchema.safeParse(body);
    if (!parsed.success) return validationErrorResponse(parsed.error);
    const input = parsed.data;
    const name = normalizeString(input.name);

    const now = Date.now();
    const created = await AgreeTopicModel.create({
      name,
      slug: makeSlug(normalizeString(input.slug) || name),
      description: normalizeString(input.description),
      eyebrow: normalizeString(input.eyebrow) || "Setelah Klik Agree",
      icon: normalizeString(input.icon) || "cpu",
      isActive: input.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    });

    revalidateAgreeCaches();
    return NextResponse.json(created.toObject(), { status: 201 });
  } catch (error) {
    logApiError("POST /api/agree/topics error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
