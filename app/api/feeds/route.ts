// app/api/feeds/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FeedModel } from "@/lib/models/Feed";
import {
  feedToJson,
  computeLineFields,
  revalidateFeedCachesBySlug,
} from "@/lib/api/feed-helpers";
import {
  cachedJson,
  dbUnavailableResponse,
  invalidPaginationResponse,
  invalidSlugResponse,
  logApiError,
  normalizeSlug,
  parsePositiveInt,
  validationErrorResponse,
} from "@/lib/api-helpers";
import { slugify } from "@/lib/slugify";
import { getNextSequence } from "@/lib/sequence";



export const dynamic = "force-dynamic";
const FEED_CATEGORIES = ["Berita", "Tutorial", "Riset"] as const;

// ─── GET /api/feeds ───────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const { searchParams } = req.nextUrl;
    const category = searchParams.get("category");
    const slug = normalizeSlug(searchParams.get("slug"));
    const rawSlug = searchParams.get("slug");
    const page = parsePositiveInt(searchParams.get("page"), 1);
    const limit = parsePositiveInt(searchParams.get("limit"), 20);

    if (rawSlug !== null && !slug) return invalidSlugResponse();
    if (page === null || limit === null || limit > 100) {
      return invalidPaginationResponse();
    }

    if (category && !FEED_CATEGORIES.includes(category as (typeof FEED_CATEGORIES)[number])) {
      return validationErrorResponse({ message: "Invalid category" });
    }

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
    logApiError("GET /api/feeds error", error, {
      query: req.nextUrl.searchParams.toString(),
    });
    return NextResponse.json(
      { error: "Internal Server Error" },
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
    if (!body?.title || !body?.category || !Array.isArray(body?.lines)) {
      return validationErrorResponse({ message: "Missing required fields" });
    }
    if (!FEED_CATEGORIES.includes(body.category)) {
      return validationErrorResponse({ message: "Invalid category" });
    }
    const nextId = await getNextSequence("feedId");
    const slug = slugify(body.title, nextId);

    const newFeed = await FeedModel.create({
      id: nextId,
      slug,
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

    revalidateFeedCachesBySlug(slug);

    return NextResponse.json(feedToJson(newFeed), { status: 201 });
  } catch (error) {
    logApiError("POST /api/feeds error", error, { method: "POST" });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
