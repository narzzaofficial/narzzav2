import { NextRequest, NextResponse } from "next/server";

import { dbUnavailableResponse, logApiError, validationErrorResponse } from "@/lib/api-helpers";
import { makeSlug, normalizeString, toObjectId } from "@/lib/api/agree-crud";
import { revalidateAgreeCaches } from "@/lib/api/agree-helpers";
import { connectDB } from "@/lib/mongodb";
import { AgreeDocumentModel } from "@/lib/models/AgreeDocument";
import { createAgreeDocumentSchema } from "@/lib/validation/agree";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const appId = req.nextUrl.searchParams.get("appId");
    const filter = appId ? { appId: toObjectId(appId) } : {};
    const items = await AgreeDocumentModel.find(filter)
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({ items });
  } catch (error) {
    logApiError("GET /api/agree/documents error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const body = await req.json();
    const parsed = createAgreeDocumentSchema.safeParse(body);
    if (!parsed.success) return validationErrorResponse(parsed.error);

    const input = parsed.data;
    const title = normalizeString(input.title);
    const appId = toObjectId(input.appId);
    if (!appId) return validationErrorResponse({ message: "Invalid appId" });

    const now = Date.now();
    const created = await AgreeDocumentModel.create({
      title,
      slug: makeSlug(normalizeString(input.slug) || title),
      appId,
      type: input.type,
      dek: normalizeString(input.dek),
      tosOriginal: input.tosOriginal,
      tosTranslation: input.tosTranslation,
      analysis: input.analysis,
      content: input.content,
      isActive: input.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    });

    revalidateAgreeCaches();
    return NextResponse.json(created.toObject(), { status: 201 });
  } catch (error) {
    logApiError("POST /api/agree/documents error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
