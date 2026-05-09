import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { AnalyticsModel } from "@/lib/models/Analytics";
import { requireAdminApiRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authError = await requireAdminApiRequest();
    if (authError) return authError;

    const conn = await connectDB();
    if (!conn) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

    const days = Math.min(
      Math.max(parseInt(req.nextUrl.searchParams.get("days") || "30"), 7),
      90
    );
    const since = Date.now() - days * 24 * 60 * 60 * 1000;
    const sinceDate = new Date(since).toISOString().split("T")[0];
    const today = new Date().toISOString().split("T")[0];

    const [
      totalViews,
      uniqueSessionIds,
      todayViews,
      dailyViews,
      topPages,
      topContent,
      deviceBreakdown,
      contentTypeBreakdown,
      referrerBreakdown,
    ] = await Promise.all([
      // Total views in period
      AnalyticsModel.countDocuments({ timestamp: { $gte: since } }),

      // Unique sessions in period
      AnalyticsModel.distinct("sessionId", { timestamp: { $gte: since } }),

      // Today's views
      AnalyticsModel.countDocuments({ date: today }),

      // Views & sessions per day
      AnalyticsModel.aggregate([
        { $match: { date: { $gte: sinceDate } } },
        {
          $group: {
            _id: "$date",
            views: { $sum: 1 },
            sessions: { $addToSet: "$sessionId" },
          },
        },
        {
          $project: {
            date: "$_id",
            views: 1,
            sessions: { $size: "$sessions" },
            _id: 0,
          },
        },
        { $sort: { date: 1 } },
      ]),

      // Top 10 most visited pages
      AnalyticsModel.aggregate([
        { $match: { timestamp: { $gte: since } } },
        { $group: { _id: "$path", views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 10 },
        { $project: { path: "$_id", views: 1, _id: 0 } },
      ]),

      // Top content (feeds & laws) by slug
      AnalyticsModel.aggregate([
        {
          $match: {
            timestamp: { $gte: since },
            contentSlug: { $exists: true, $ne: null },
          },
        },
        {
          $group: {
            _id: { slug: "$contentSlug", type: "$contentType" },
            views: { $sum: 1 },
          },
        },
        { $sort: { views: -1 } },
        { $limit: 10 },
        {
          $project: {
            slug: "$_id.slug",
            type: "$_id.type",
            views: 1,
            _id: 0,
          },
        },
      ]),

      // Device breakdown
      AnalyticsModel.aggregate([
        { $match: { timestamp: { $gte: since } } },
        { $group: { _id: "$device", count: { $sum: 1 } } },
        { $project: { device: "$_id", count: 1, _id: 0 } },
      ]),

      // Content type breakdown
      AnalyticsModel.aggregate([
        { $match: { timestamp: { $gte: since } } },
        { $group: { _id: "$contentType", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { type: "$_id", count: 1, _id: 0 } },
      ]),

      // Top referrers
      AnalyticsModel.aggregate([
        {
          $match: {
            timestamp: { $gte: since },
            referrer: { $nin: ["direct", "", null] },
          },
        },
        { $group: { _id: "$referrer", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
        { $project: { referrer: "$_id", count: 1, _id: 0 } },
      ]),
    ]);

    return NextResponse.json({
      period: days,
      overview: {
        totalViews,
        uniqueSessions: uniqueSessionIds.length,
        todayViews,
      },
      dailyViews,
      topPages,
      topContent,
      deviceBreakdown,
      contentTypeBreakdown,
      referrerBreakdown,
    });
  } catch (error) {
    console.error("GET /api/admin/analytics error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
