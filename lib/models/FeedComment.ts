import mongoose, { Schema, model, models } from "mongoose";

export interface IFeedComment {
  feedId: number;
  feedSlug: string;
  name: string;
  message: string;
  createdAt: number;
}

const FeedCommentSchema = new Schema<IFeedComment>(
  {
    feedId: { type: Number, required: true, index: true },
    feedSlug: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 60 },
    message: { type: String, required: true, trim: true, maxlength: 1200 },
    createdAt: { type: Number, default: Date.now, index: true },
  },
  { versionKey: false }
);

FeedCommentSchema.index({ feedId: 1, createdAt: -1 });

export const FeedCommentModel =
  (models.FeedComment as mongoose.Model<IFeedComment>) ||
  model<IFeedComment>("FeedComment", FeedCommentSchema);

