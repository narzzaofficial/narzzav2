import { NextRequest, NextResponse } from "next/server";

import { dbUnavailableResponse, logApiError, validationErrorResponse } from "@/lib/api-helpers";
import { makeSlug, normalizeString, toObjectId } from "@/lib/api/agree-crud";
import { revalidateAgreeCaches } from "@/lib/api/agree-helpers";
import { connectDB } from "@/lib/mongodb";
import { AgreeAppModel } from "@/lib/models/AgreeApp";
import { createAgreeAppSchema } from "@/lib/validation/agree";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const companyId = req.nextUrl.searchParams.get("companyId");
    const filter = companyId ? { companyId: toObjectId(companyId) } : {};
    const items = await AgreeAppModel.find(filter)
      .sort({ isPopular: -1, popularScore: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({ items });
  } catch (error) {
    logApiError("GET /api/agree/apps error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const body = await req.json();
    const parsed = createAgreeAppSchema.safeParse(body);
    if (!parsed.success) return validationErrorResponse(parsed.error);

    const input = parsed.data;
    const name = normalizeString(input.name);
    const companyId = toObjectId(input.companyId);
    if (!companyId) return validationErrorResponse({ message: "Invalid companyId" });

    const now = Date.now();
    const created = await AgreeAppModel.create({
      name,
      slug: makeSlug(normalizeString(input.slug) || name),
      companyId,
      description: normalizeString(input.description),
      icon: normalizeString(input.icon),
      isPopular: Boolean(input.isPopular),
      popularScore: input.popularScore ?? 0,
      isActive: input.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    });

    revalidateAgreeCaches();
    return NextResponse.json(created.toObject(), { status: 201 });
  } catch (error) {
    logApiError("POST /api/agree/apps error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
