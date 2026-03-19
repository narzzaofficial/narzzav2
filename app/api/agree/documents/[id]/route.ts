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
import { AgreeDocumentModel } from "@/lib/models/AgreeDocument";
import { updateAgreeDocumentSchema } from "@/lib/validation/agree";

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

    const item = await AgreeDocumentModel.findById(objectId).lean();
    if (!item) return NextResponse.json({ error: "Document not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch (error) {
    logApiError("GET /api/agree/documents/[id] error", error);
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
    const parsed = updateAgreeDocumentSchema.safeParse(body);
    if (!parsed.success) return validationErrorResponse(parsed.error);
    const input = parsed.data;
    const update: Record<string, unknown> = { updatedAt: Date.now() };

    if (input.title !== undefined) {
      const title = normalizeString(input.title);
      if (!title) return validationErrorResponse({ message: "Document title cannot be empty" });
      update.title = title;
      if (input.slug === undefined) update.slug = makeSlug(title);
    }
    if (input.slug !== undefined) update.slug = makeSlug(normalizeString(input.slug));
    if (input.appId !== undefined) {
      const appId = toObjectId(input.appId);
      if (!appId) return validationErrorResponse({ message: "Invalid appId" });
      update.appId = appId;
    }
    if (input.type !== undefined) update.type = input.type;
    if (input.dek !== undefined) update.dek = normalizeString(input.dek);
    if (input.tosOriginal !== undefined) update.tosOriginal = input.tosOriginal;
    if (input.tosTranslation !== undefined) update.tosTranslation = input.tosTranslation;
    if (input.analysis !== undefined) update.analysis = input.analysis;
    if (input.content !== undefined) update.content = input.content;
    if (input.isActive !== undefined) update.isActive = Boolean(input.isActive);

    const item = await AgreeDocumentModel.findByIdAndUpdate(objectId, { $set: update }, { new: true, lean: true });
    if (!item) return NextResponse.json({ error: "Document not found" }, { status: 404 });

    revalidateAgreeCaches();
    return NextResponse.json(item);
  } catch (error) {
    logApiError("PUT /api/agree/documents/[id] error", error);
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

    const result = await AgreeDocumentModel.findByIdAndDelete(objectId).lean();
    if (!result) return NextResponse.json({ error: "Document not found" }, { status: 404 });

    revalidateAgreeCaches();
    return NextResponse.json({ success: true });
  } catch (error) {
    logApiError("DELETE /api/agree/documents/[id] error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
