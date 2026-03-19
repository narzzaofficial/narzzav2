import mongoose, { model, models, Schema } from "mongoose";

export interface IAgreeTopic {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  eyebrow: string;
  icon: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

const AgreeTopicSchema = new Schema<IAgreeTopic>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    description: { type: String, default: "" },
    eyebrow: { type: String, default: "Setelah Klik Agree" },
    icon: { type: String, default: "cpu" },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: Date.now },
  },
  { versionKey: false }
);

AgreeTopicSchema.index({ isActive: 1, name: 1 });

export const AgreeTopicModel =
  (models.AgreeTopic as mongoose.Model<IAgreeTopic>) ||
  model<IAgreeTopic>("AgreeTopic", AgreeTopicSchema);
