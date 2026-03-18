import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

import { connectDB } from "@/lib/mongodb";
import { FeedCommentModel } from "@/lib/models/FeedComment";
import { dbUnavailableResponse } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

function normalizeComment(doc: {
  _id: unknown;
  feedId: number;
  feedSlug: string;
  name: string;
  message: string;
  createdAt: number;
}) {
  return {
    id: String(doc._id),
    feedId: doc.feedId,
    feedSlug: doc.feedSlug,
    name: doc.name,
    message: doc.message,
    createdAt: doc.createdAt,
  };
}

export async function GET(req: NextRequest) {
  try {
    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const feedId = Number(req.nextUrl.searchParams.get("feedId"));
    if (!Number.isFinite(feedId) || feedId <= 0) {
      return NextResponse.json({ error: "Invalid feedId" }, { status: 400 });
    }

    const comments = await FeedCommentModel.find({ feedId })
      .sort({ createdAt: -1 })
      .limit(80)
      .lean();

    return NextResponse.json(comments.map(normalizeComment), {
      headers: {
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=240",
      },
    });
  } catch (error) {
    console.error("GET /api/comments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const body = await req.json();
    const feedId = Number(body.feedId);
    const feedSlug = String(body.feedSlug || "").trim();
    const name = String(body.name || "").trim();
    const message = String(body.message || "").trim();

    if (!Number.isFinite(feedId) || feedId <= 0) {
      return NextResponse.json({ error: "Invalid feedId" }, { status: 400 });
    }
    if (!feedSlug) {
      return NextResponse.json(
        { error: "feedSlug is required" },
        { status: 400 }
      );
    }
    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Nama minimal 2 karakter" },
        { status: 400 }
      );
    }
    if (!message || message.length < 2) {
      return NextResponse.json(
        { error: "Komentar minimal 2 karakter" },
        { status: 400 }
      );
    }

    const created = await FeedCommentModel.create({
      feedId,
      feedSlug,
      name: name.slice(0, 60),
      message: message.slice(0, 1200),
      createdAt: Date.now(),
    });

    revalidateTag("comments", "");
    revalidateTag(`comments-feed-${feedId}`, "");
    revalidatePath(`/feeds/${feedSlug}`);

    return NextResponse.json(normalizeComment(created.toObject()), {
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/comments error:", error);
    return NextResponse.json(
      { error: "Failed to submit comment" },
      { status: 500 }
    );
  }
}
