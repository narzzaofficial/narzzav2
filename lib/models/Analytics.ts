import mongoose, { Schema, model, models } from "mongoose";

export interface IAnalyticsEvent {
  sessionId: string;
  path: string;
  referrer: string;
  device: "mobile" | "tablet" | "desktop";
  contentType: "home" | "feed" | "law" | "category" | "laws_list" | "agree" | "other";
  contentSlug?: string;
  contentCategory?: string;
  timestamp: number;
  date: string; // YYYY-MM-DD
}

const AnalyticsSchema = new Schema<IAnalyticsEvent>(
  {
    sessionId: { type: String, required: true, maxlength: 64 },
    path: { type: String, required: true, maxlength: 500 },
    referrer: { type: String, default: "direct", maxlength: 500 },
    device: { type: String, enum: ["mobile", "tablet", "desktop"], default: "desktop" },
    contentType: {
      type: String,
      enum: ["home", "feed", "law", "category", "laws_list", "agree", "other"],
      default: "other",
    },
    contentSlug: { type: String, maxlength: 300 },
    contentCategory: { type: String, maxlength: 50 },
    timestamp: { type: Number, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
  },
  { versionKey: false }
);

AnalyticsSchema.index({ timestamp: -1 });
AnalyticsSchema.index({ date: 1 });
AnalyticsSchema.index({ path: 1, timestamp: -1 });
AnalyticsSchema.index({ contentSlug: 1, timestamp: -1 }, { sparse: true });
AnalyticsSchema.index({ sessionId: 1, date: 1 });

export const AnalyticsModel =
  (models.Analytics as mongoose.Model<IAnalyticsEvent>) ||
  model<IAnalyticsEvent>("Analytics", AnalyticsSchema);
