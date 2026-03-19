import mongoose, { model, models, Schema } from "mongoose";

export interface IAgreeApp {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  companyId: mongoose.Types.ObjectId;
  description: string;
  icon: string;
  isPopular: boolean;
  popularScore: number;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

const AgreeAppSchema = new Schema<IAgreeApp>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    companyId: { type: Schema.Types.ObjectId, ref: "AgreeCompany", required: true, index: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "" },
    isPopular: { type: Boolean, default: false },
    popularScore: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: Date.now },
  },
  { versionKey: false }
);

AgreeAppSchema.index({ companyId: 1, slug: 1 }, { unique: true });
AgreeAppSchema.index({ isPopular: 1, popularScore: -1, createdAt: -1 });
AgreeAppSchema.index({ companyId: 1, isActive: 1, name: 1 });

export const AgreeAppModel =
  (models.AgreeApp as mongoose.Model<IAgreeApp>) ||
  model<IAgreeApp>("AgreeApp", AgreeAppSchema);

