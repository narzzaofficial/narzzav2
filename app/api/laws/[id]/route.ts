import { NextRequest, NextResponse } from "next/server";

import {
  dbUnavailableResponse,
  invalidIdResponse,
  logApiError,
  validationErrorResponse,
} from "@/lib/api-helpers";
import { lawToJson, revalidateLawCachesBySlug } from "@/lib/api/law-helpers";
import { connectDB } from "@/lib/mongodb";
import { LawDocModel } from "@/lib/models/LawDoc";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const lawId = Number(id);
    if (!Number.isInteger(lawId) || lawId < 1) return invalidIdResponse();

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const law = await LawDocModel.findOne({ id: lawId }).lean();
    if (!law) {
      return NextResponse.json(
        { error: "Law document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(lawToJson(law));
  } catch (error) {
    logApiError("GET /api/laws/[id] error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const lawId = Number(id);
    if (!Number.isInteger(lawId) || lawId < 1) return invalidIdResponse();

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const body = await req.json();
    if (!body || typeof body !== "object") {
      return validationErrorResponse({ message: "Invalid request body" });
    }
    const existing = await LawDocModel.findOne({ id: lawId }).lean();
    if (!existing) {
      return NextResponse.json(
        { error: "Law document not found" },
        { status: 404 }
      );
    }

    const result = await LawDocModel.findOneAndUpdate(
      { id: lawId },
      { $set: body },
      { new: true, lean: true }
    );

    if (!result) {
      return NextResponse.json(
        { error: "Law document not found" },
        { status: 404 }
      );
    }

    revalidateLawCachesBySlug(result.slug);
    if (existing.slug !== result.slug) {
      revalidateLawCachesBySlug(existing.slug);
    }
    return NextResponse.json(lawToJson(result));
  } catch (error) {
    logApiError("PUT /api/laws/[id] error", error, { method: "PUT" });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const lawId = Number(id);
    if (!Number.isInteger(lawId) || lawId < 1) return invalidIdResponse();

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const law = await LawDocModel.findOne({ id: lawId }).lean();
    if (!law) {
      return NextResponse.json(
        { error: "Law document not found" },
        { status: 404 }
      );
    }

    await LawDocModel.deleteOne({ id: lawId });
    revalidateLawCachesBySlug(law.slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    logApiError("DELETE /api/laws/[id] error", error, { method: "DELETE" });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
