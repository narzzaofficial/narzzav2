import { NextRequest, NextResponse } from "next/server";

import {
  dbUnavailableResponse,
  invalidIdResponse,
  logApiError,
  validationErrorResponse,
} from "@/lib/api-helpers";
import { makeSlug, normalizeString, toObjectId } from "@/lib/api/agree-crud";
import { revalidateAgreeCaches } from "@/lib/api/agree-helpers";
import { requireAdminApiRequest } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { AgreeAppModel } from "@/lib/models/AgreeApp";
import { AgreeDocumentModel } from "@/lib/models/AgreeDocument";
import { updateAgreeAppSchema } from "@/lib/validation/agree";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const authError = await requireAdminApiRequest();
    if (authError) return authError;

    const { id } = await context.params;
    const objectId = toObjectId(id);
    if (!objectId) return invalidIdResponse();

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const item = await AgreeAppModel.findById(objectId).lean();
    if (!item) return NextResponse.json({ error: "App not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch (error) {
    logApiError("GET /api/agree/apps/[id] error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const authError = await requireAdminApiRequest();
    if (authError) return authError;

    const { id } = await context.params;
    const objectId = toObjectId(id);
    if (!objectId) return invalidIdResponse();

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const body = await req.json();
    const parsed = updateAgreeAppSchema.safeParse(body);
    if (!parsed.success) return validationErrorResponse(parsed.error);
    const input = parsed.data;
    const update: Record<string, unknown> = { updatedAt: Date.now() };

    if (input.name !== undefined) {
      const name = normalizeString(input.name);
      if (!name) return validationErrorResponse({ message: "App name cannot be empty" });
      update.name = name;
      if (input.slug === undefined) update.slug = makeSlug(name);
    }
    if (input.slug !== undefined) update.slug = makeSlug(normalizeString(input.slug));
    if (input.companyId !== undefined) {
      const companyId = toObjectId(input.companyId);
      if (!companyId) return validationErrorResponse({ message: "Invalid companyId" });
      update.companyId = companyId;
    }
    if (input.description !== undefined) update.description = normalizeString(input.description);
    if (input.icon !== undefined) update.icon = normalizeString(input.icon);
    if (input.isPopular !== undefined) update.isPopular = Boolean(input.isPopular);
    if (input.popularScore !== undefined) update.popularScore = input.popularScore;
    if (input.isActive !== undefined) update.isActive = Boolean(input.isActive);

    const item = await AgreeAppModel.findByIdAndUpdate(objectId, { $set: update }, { new: true, lean: true });
    if (!item) return NextResponse.json({ error: "App not found" }, { status: 404 });

    revalidateAgreeCaches();
    return NextResponse.json(item);
  } catch (error) {
    logApiError("PUT /api/agree/apps/[id] error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const authError = await requireAdminApiRequest();
    if (authError) return authError;

    const { id } = await context.params;
    const objectId = toObjectId(id);
    if (!objectId) return invalidIdResponse();

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const inUse = await AgreeDocumentModel.exists({ appId: objectId });
    if (inUse) {
      return NextResponse.json(
        { error: "App masih dipakai oleh document. Hapus document terlebih dahulu." },
        { status: 409 }
      );
    }

    const result = await AgreeAppModel.findByIdAndDelete(objectId).lean();
    if (!result) return NextResponse.json({ error: "App not found" }, { status: 404 });

    revalidateAgreeCaches();
    return NextResponse.json({ success: true });
  } catch (error) {
    logApiError("DELETE /api/agree/apps/[id] error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
