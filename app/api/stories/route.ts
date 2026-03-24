import { NextRequest, NextResponse } from "next/server";

import {
  dbUnavailableResponse,
  invalidPaginationResponse,
  logApiError,
  parsePositiveInt,
  validationErrorResponse,
} from "@/lib/api-helpers";
import { requireAdminApiRequest } from "@/lib/auth";
import { revalidateStoryCaches, storyToJson } from "@/lib/api/story-helpers";
import { connectDB } from "@/lib/mongodb";
import { StoryModel } from "@/lib/models/Story";
import { getNextSequence } from "@/lib/sequence";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authError = await requireAdminApiRequest();
    if (authError) return authError;

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const { searchParams } = req.nextUrl;
    const page = parsePositiveInt(searchParams.get("page"), 1);
    const limit = parsePositiveInt(searchParams.get("limit"), 100);

    if (page === null || limit === null || limit > 200) {
      return invalidPaginationResponse();
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      StoryModel.find({})
        .sort({ viral: -1, createdAt: -1, id: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      StoryModel.countDocuments({}),
    ]);

    return NextResponse.json({
      items: items.map(storyToJson),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + items.length < total,
      },
    });
  } catch (error) {
    logApiError("GET /api/stories error", error, {
      query: req.nextUrl.searchParams.toString(),
    });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authError = await requireAdminApiRequest();
    if (authError) return authError;

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const body = await req.json();
    if (!body?.name || !body?.type) {
      return validationErrorResponse({ message: "Missing required fields" });
    }

    const maxStory = await StoryModel.findOne({}).sort({ id: -1 }).select("id").lean();
    const nextId = await getNextSequence("storyId", maxStory?.id ?? 0);
    const name = String(body.name).trim();
    const label = String(body.label || name.slice(0, 2).toUpperCase()).trim();

    const created = await StoryModel.create({
      id: nextId,
      name,
      label,
      type: String(body.type).trim(),
      image: String(body.image ?? ""),
      palette: String(body.palette ?? ""),
      viral: Boolean(body.viral),
      createdAt: Date.now(),
    });

    revalidateStoryCaches();
    return NextResponse.json(storyToJson(created), { status: 201 });
  } catch (error) {
    logApiError("POST /api/stories error", error, { method: "POST" });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
