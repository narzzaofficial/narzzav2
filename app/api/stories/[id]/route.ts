import { NextRequest, NextResponse } from "next/server";

import {
  dbUnavailableResponse,
  invalidIdResponse,
  logApiError,
  validationErrorResponse,
} from "@/lib/api-helpers";
import { requireAdminApiRequest } from "@/lib/auth";
import { revalidateStoryCaches, storyToJson } from "@/lib/api/story-helpers";
import { connectDB } from "@/lib/mongodb";
import { StoryModel } from "@/lib/models/Story";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const authError = await requireAdminApiRequest();
    if (authError) return authError;

    const { id } = await context.params;
    const storyId = Number(id);
    if (!Number.isInteger(storyId) || storyId < 1) return invalidIdResponse();

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const story = await StoryModel.findOne({ id: storyId }).lean();
    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    return NextResponse.json(storyToJson(story));
  } catch (error) {
    logApiError("GET /api/stories/[id] error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const authError = await requireAdminApiRequest();
    if (authError) return authError;

    const { id } = await context.params;
    const storyId = Number(id);
    if (!Number.isInteger(storyId) || storyId < 1) return invalidIdResponse();

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const body = await req.json();
    if (!body || typeof body !== "object") {
      return validationErrorResponse({ message: "Invalid request body" });
    }

    const existing = await StoryModel.findOne({ id: storyId }).lean();
    if (!existing) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    const result = await StoryModel.findOneAndUpdate(
      { id: storyId },
      {
        $set: {
          ...body,
          ...(body.name && !body.label
            ? { label: String(body.name).slice(0, 2).toUpperCase() }
            : {}),
        },
      },
      { new: true, lean: true }
    );

    if (!result) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    revalidateStoryCaches();
    return NextResponse.json(storyToJson(result));
  } catch (error) {
    logApiError("PUT /api/stories/[id] error", error, { method: "PUT" });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const authError = await requireAdminApiRequest();
    if (authError) return authError;

    const { id } = await context.params;
    const storyId = Number(id);
    if (!Number.isInteger(storyId) || storyId < 1) return invalidIdResponse();

    const conn = await connectDB();
    if (!conn) return dbUnavailableResponse();

    const story = await StoryModel.findOne({ id: storyId }).lean();
    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    await StoryModel.deleteOne({ id: storyId });
    revalidateStoryCaches();
    return NextResponse.json({ success: true });
  } catch (error) {
    logApiError("DELETE /api/stories/[id] error", error, { method: "DELETE" });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
