// app/api/feeds/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FeedModel } from "@/lib/models/Feed";
import {
  feedToJson,
  computeLineFields,
  revalidateFeedCachesBySlug,
} from "@/lib/api/feed-helpers";
import {
  dbUnavailableResponse,
  invalidIdResponse,
  logApiError,
  validationErrorResponse,
} from "@/lib/api-helpers";
import { requireAdminApiRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// ─── GET /api/feeds/[id] ──────────────────────────────────────────────────────
export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const authError = await requireAdminApiRequest();
    if (authError) return authError;

    const { id } = await context.params;
    const feedId = Number(id);
    if (!Number.isInteger(feedId) || feedId < 1) return invalidIdResponse();

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const feed = await FeedModel.findOne({ id: feedId }).lean();
    if (!feed) {
      return NextResponse.json({ error: "Feed not found" }, { status: 404 });
    }

    return NextResponse.json(feedToJson(feed));
  } catch (error) {
    logApiError("GET /api/feeds/[id] error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ─── PUT /api/feeds/[id] ──────────────────────────────────────────────────────
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const authError = await requireAdminApiRequest();
    if (authError) return authError;

    const { id } = await context.params;
    const feedId = Number(id);
    if (!Number.isInteger(feedId) || feedId < 1) return invalidIdResponse();

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const body = await req.json();
    if (!body || typeof body !== "object") {
      return validationErrorResponse({ message: "Invalid request body" });
    }
    const existing = await FeedModel.findOne({ id: feedId }).lean();
    if (!existing) {
      return NextResponse.json({ error: "Feed not found" }, { status: 404 });
    }

    const updateData = {
      ...body,
      // Kalau lines diupdate, hitung ulang lineCount dan previewLines
      ...(body.lines ? computeLineFields(body.lines) : {}),
    };

    const result = await FeedModel.findOneAndUpdate(
      { id: feedId },
      { $set: updateData },
      { new: true, lean: true }
    );

    if (!result) {
      return NextResponse.json({ error: "Feed not found" }, { status: 404 });
    }

    revalidateFeedCachesBySlug(result.slug);
    if (existing.slug !== result.slug) {
      revalidateFeedCachesBySlug(existing.slug);
    }

    return NextResponse.json(feedToJson(result));
  } catch (error) {
    logApiError("PUT /api/feeds/[id] error", error, { method: "PUT" });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/feeds/[id] ───────────────────────────────────────────────────
export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const authError = await requireAdminApiRequest();
    if (authError) return authError;

    const { id } = await context.params;
    const feedId = Number(id);
    if (!Number.isInteger(feedId) || feedId < 1) return invalidIdResponse();

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const feed = await FeedModel.findOne({ id: feedId }).lean();
    if (!feed) {
      return NextResponse.json({ error: "Feed not found" }, { status: 404 });
    }

    await FeedModel.deleteOne({ id: feedId });

    revalidateFeedCachesBySlug(feed.slug);

    return NextResponse.json({ success: true });
  } catch (error) {
    logApiError("DELETE /api/feeds/[id] error", error, { method: "DELETE" });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
