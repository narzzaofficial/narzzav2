import { NextRequest, NextResponse } from "next/server";

import {
  dbUnavailableResponse,
  invalidIdResponse,
  logApiError,
  validationErrorResponse,
} from "@/lib/api-helpers";
import { makeSlug, normalizeString, toObjectId } from "@/lib/api/agree-crud";
import { revalidateAgreeCaches } from "@/lib/api/agree-helpers";
import { connectDB } from "@/lib/mongodb";
import { AgreeCompanyModel } from "@/lib/models/AgreeCompany";
import { AgreeTopicModel } from "@/lib/models/AgreeTopic";
import { updateAgreeTopicSchema } from "@/lib/validation/agree";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const objectId = toObjectId(id);
    if (!objectId) return invalidIdResponse();

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const item = await AgreeTopicModel.findById(objectId).lean();
    if (!item) return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch (error) {
    logApiError("GET /api/agree/topics/[id] error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const objectId = toObjectId(id);
    if (!objectId) return invalidIdResponse();

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const body = await req.json();
    const parsed = updateAgreeTopicSchema.safeParse(body);
    if (!parsed.success) return validationErrorResponse(parsed.error);
    const input = parsed.data;
    const update: Record<string, unknown> = { updatedAt: Date.now() };

    if (input.name !== undefined) {
      const name = normalizeString(input.name);
      if (!name) return validationErrorResponse({ message: "Topic name cannot be empty" });
      update.name = name;
      if (input.slug === undefined) update.slug = makeSlug(name);
    }
    if (input.slug !== undefined) update.slug = makeSlug(normalizeString(input.slug));
    if (input.description !== undefined) update.description = normalizeString(input.description);
    if (input.eyebrow !== undefined) update.eyebrow = normalizeString(input.eyebrow);
    if (input.icon !== undefined) update.icon = normalizeString(input.icon);
    if (input.isActive !== undefined) update.isActive = Boolean(input.isActive);

    const item = await AgreeTopicModel.findByIdAndUpdate(objectId, { $set: update }, { new: true, lean: true });
    if (!item) return NextResponse.json({ error: "Topic not found" }, { status: 404 });

    revalidateAgreeCaches();
    return NextResponse.json(item);
  } catch (error) {
    logApiError("PUT /api/agree/topics/[id] error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const objectId = toObjectId(id);
    if (!objectId) return invalidIdResponse();

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const inUse = await AgreeCompanyModel.exists({ topicId: objectId });
    if (inUse) {
      return NextResponse.json(
        { error: "Topic masih dipakai oleh company. Hapus company terlebih dahulu." },
        { status: 409 }
      );
    }

    const result = await AgreeTopicModel.findByIdAndDelete(objectId).lean();
    if (!result) return NextResponse.json({ error: "Topic not found" }, { status: 404 });

    revalidateAgreeCaches();
    return NextResponse.json({ success: true });
  } catch (error) {
    logApiError("DELETE /api/agree/topics/[id] error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
