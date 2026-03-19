import mongoose, { model, models, Schema } from "mongoose";

export interface IStory {
  id: number;
  name: string;
  label: string;
  type: string;
  image: string;
  palette?: string;
  viral: boolean;
  createdAt: number;
}

const StorySchema = new Schema<IStory>(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
    palette: { type: String, default: "" },
    viral: { type: Boolean, default: false },
    createdAt: { type: Number, default: Date.now },
  },
  { versionKey: false }
);

StorySchema.index({ createdAt: -1 });
StorySchema.index({ viral: 1, createdAt: -1 });
StorySchema.index({ name: "text", type: "text", label: "text" });

export const StoryModel =
  (models.Story as mongoose.Model<IStory>) || model<IStory>("Story", StorySchema);
