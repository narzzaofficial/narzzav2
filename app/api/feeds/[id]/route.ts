// app/api/feeds/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FeedModel } from "@/lib/models/Feed";
import {
  feedToJson,
  computeLineFields,
  revalidateAllFeedCaches,
} from "@/lib/api/feed-helpers";
import { dbUnavailableResponse, invalidIdResponse } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// ─── GET /api/feeds/[id] ──────────────────────────────────────────────────────
export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const feedId = Number(id);
    if (Number.isNaN(feedId)) return invalidIdResponse();

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const feed = await FeedModel.findOne({ id: feedId }).lean();
    if (!feed) {
      return NextResponse.json({ error: "Feed not found" }, { status: 404 });
    }

    return NextResponse.json(feedToJson(feed));
  } catch (error) {
    console.error("GET /api/feeds/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feed" },
      { status: 500 }
    );
  }
}

// ─── PUT /api/feeds/[id] ──────────────────────────────────────────────────────
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const feedId = Number(id);
    if (Number.isNaN(feedId)) return invalidIdResponse();

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const body = await req.json();

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

    revalidateAllFeedCaches();

    return NextResponse.json(feedToJson(result));
  } catch (error) {
    console.error("PUT /api/feeds/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update feed" },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/feeds/[id] ───────────────────────────────────────────────────
export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const feedId = Number(id);
    if (Number.isNaN(feedId)) return invalidIdResponse();

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const feed = await FeedModel.findOne({ id: feedId }).lean();
    if (!feed) {
      return NextResponse.json({ error: "Feed not found" }, { status: 404 });
    }

    await FeedModel.deleteOne({ id: feedId });

    revalidateAllFeedCaches();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/feeds/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete feed" },
      { status: 500 }
    );
  }
}