import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { AnalyticsModel } from "@/lib/models/Analytics";

const VALID_DEVICES = ["mobile", "tablet", "desktop"];
const VALID_TYPES = ["home", "feed", "law", "category", "laws_list", "agree", "other"];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.sessionId || !body?.path || typeof body.path !== "string") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const conn = await connectDB();
    if (!conn) return NextResponse.json({ ok: true });

    const today = new Date().toISOString().split("T")[0];

    await AnalyticsModel.create({
      sessionId: String(body.sessionId).slice(0, 64),
      path: String(body.path).slice(0, 500),
      referrer: String(body.referrer || "direct").slice(0, 500),
      device: VALID_DEVICES.includes(body.device) ? body.device : "desktop",
      contentType: VALID_TYPES.includes(body.contentType) ? body.contentType : "other",
      contentSlug: body.contentSlug ? String(body.contentSlug).slice(0, 300) : undefined,
      contentCategory: body.contentCategory ? String(body.contentCategory).slice(0, 50) : undefined,
      timestamp: Date.now(),
      date: today,
    });

    return NextResponse.json({ ok: true });
  } catch {
    // Always return 200 so tracking errors never break the user experience
    return NextResponse.json({ ok: true });
  }
}
