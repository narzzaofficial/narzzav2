import { NextRequest, NextResponse } from "next/server";

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
import { lawToJson, revalidateLawCachesBySlug } from "@/lib/api/law-helpers";
import { connectDB } from "@/lib/mongodb";
import { LawDocModel } from "@/lib/models/LawDoc";
import { HUKUM_CATEGORIES } from "@/lib/law-categories";
import { requireAdminApiRequest } from "@/lib/auth";
import { getNextSequence } from "@/lib/sequence";
import { slugify } from "@/lib/slugify";
import type { HukumCategory } from "@/types/content";

export const dynamic = "force-dynamic";

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
    if (
      category &&
      !HUKUM_CATEGORIES.includes(category as HukumCategory)
    ) {
      return validationErrorResponse({ message: "Invalid category" });
    }

    if (slug) {
      const law = await LawDocModel.findOne({ slug }).lean();
      if (!law) {
        return NextResponse.json(
          { error: "Law document not found" },
          { status: 404 }
        );
      }
      return cachedJson(lawToJson(law), 3600);
    }

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      LawDocModel.find(filter)
        .sort({ promulgatedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-originalText")
        .lean(),
      LawDocModel.countDocuments(filter),
    ]);

    const response = {
      items: items.map(lawToJson),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + items.length < total,
      },
    };

    return cachedJson(response, page === 1 ? 3600 : 300);
  } catch (error) {
    logApiError("GET /api/laws error", error, {
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
    if (!body?.title || !body?.category || !body?.number || !body?.year) {
      return validationErrorResponse({ message: "Missing required fields" });
    }
    if (!HUKUM_CATEGORIES.includes(body.category as HukumCategory)) {
      return validationErrorResponse({ message: "Invalid category" });
    }
    const nextId = await getNextSequence("lawId");
    const slug = slugify(body.title, nextId);

    const created = await LawDocModel.create({
      id: nextId,
      slug,
      title: body.title,
      category: body.category,
      summary: body.summary ?? "",
      originalText: body.originalText ?? "",
      explanationLines: body.explanationLines ?? [],
      number: body.number,
      year: body.year,
      enactedAt: body.enactedAt,
      promulgatedAt: body.promulgatedAt,
      effectiveAt: body.effectiveAt,
      status: body.status ?? "Berlaku",
      source: body.source,
      storyId: body.storyId ?? null,
      createdAt: Date.now(),
    });

    revalidateLawCachesBySlug(slug);
    return NextResponse.json(lawToJson(created), { status: 201 });
  } catch (error) {
    logApiError("POST /api/laws error", error, { method: "POST" });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
