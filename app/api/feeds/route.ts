// app/api/feeds/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FeedModel } from "@/lib/models/Feed";
import {
  feedToJson,
  computeLineFields,
  revalidateAllFeedCaches,
} from "@/lib/api/feed-helpers";
import { cachedJson, dbUnavailableResponse } from "@/lib/api-helpers";
import { slugify } from "@/lib/slugify";



export const dynamic = "force-dynamic";

// ─── GET /api/feeds ───────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const { searchParams } = req.nextUrl;
    const category = searchParams.get("category") as
      | "Berita"
      | "Tutorial"
      | "Riset"
      | null;
    const slug = searchParams.get("slug");
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "20");

    // ─── BY SLUG (untuk read page) ───────────────────────────────
    if (slug) {
      const feed = await FeedModel.findOne({ slug }).lean();
      if (!feed) {
        return NextResponse.json({ error: "Feed not found" }, { status: 404 });
      }
      return cachedJson(feedToJson(feed), 3600);
    }

    // ─── LIST WITH PAGINATION ─────────────────────────────────────
    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;

    const skip = (page - 1) * limit;

    const [feeds, total] = await Promise.all([
      FeedModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-lines") // Exclude lines untuk list (hemat bandwidth)
        .lean(),
      FeedModel.countDocuments(filter),
    ]);

    const response = {
      feeds: feeds.map(feedToJson),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + feeds.length < total,
      },
    };

    // Page 1 cache 1 jam, sisanya 5 menit
    const cacheTime = page === 1 ? 3600 : 300;
    return cachedJson(response, cacheTime);
  } catch (error) {
    console.error("GET /api/feeds error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feeds" },
      { status: 500 }
    );
  }
}

// ─── POST /api/feeds ──────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const body = await req.json();

    // Auto-increment ID
    const last = await FeedModel.findOne().sort({ id: -1 }).lean();
    const nextId = last ? last.id + 1 : 1;

    const newFeed = await FeedModel.create({
      id: nextId,
      slug: slugify(body.title, nextId),
      title: body.title,
      category: body.category,
      image: body.image,
      lines: body.lines,
      ...computeLineFields(body.lines),
      takeaway: body.takeaway,
      author: body.author ?? "",
      source: body.source,
      storyId: body.storyId,
      createdAt: Date.now(),
    });

    revalidateAllFeedCaches();

    return NextResponse.json(feedToJson(newFeed), { status: 201 });
  } catch (error) {
    console.error("POST /api/feeds error:", error);
    return NextResponse.json(
      { error: "Failed to create feed" },
      { status: 500 }
    );
  }
}