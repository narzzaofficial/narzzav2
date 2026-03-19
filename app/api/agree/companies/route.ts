import { NextRequest, NextResponse } from "next/server";

import { dbUnavailableResponse, logApiError, validationErrorResponse } from "@/lib/api-helpers";
import { makeSlug, normalizeString, toObjectId } from "@/lib/api/agree-crud";
import { revalidateAgreeCaches } from "@/lib/api/agree-helpers";
import { requireAdminApiRequest } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { AgreeCompanyModel } from "@/lib/models/AgreeCompany";
import { createAgreeCompanySchema } from "@/lib/validation/agree";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authError = await requireAdminApiRequest();
    if (authError) return authError;

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const topicId = req.nextUrl.searchParams.get("topicId");
    const filter = topicId ? { topicId: toObjectId(topicId) } : {};
    const items = await AgreeCompanyModel.find(filter)
      .sort({ isActive: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({ items });
  } catch (error) {
    logApiError("GET /api/agree/companies error", error);
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
    const parsed = createAgreeCompanySchema.safeParse(body);
    if (!parsed.success) return validationErrorResponse(parsed.error);

    const input = parsed.data;
    const name = normalizeString(input.name);
    const topicId = toObjectId(input.topicId);
    if (!topicId) return validationErrorResponse({ message: "Invalid topicId" });

    const now = Date.now();
    const created = await AgreeCompanyModel.create({
      name,
      slug: makeSlug(normalizeString(input.slug) || name),
      topicId,
      logo: normalizeString(input.logo),
      description: normalizeString(input.description),
      isActive: input.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    });

    revalidateAgreeCaches();
    return NextResponse.json(created.toObject(), { status: 201 });
  } catch (error) {
    logApiError("POST /api/agree/companies error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
