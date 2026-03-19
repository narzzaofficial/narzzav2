import mongoose, { model, models, Schema } from "mongoose";

export interface IAgreeCompany {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  topicId: mongoose.Types.ObjectId;
  logo: string;
  description: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

const AgreeCompanySchema = new Schema<IAgreeCompany>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    topicId: { type: Schema.Types.ObjectId, ref: "AgreeTopic", required: true, index: true },
    logo: { type: String, default: "" },
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: Date.now },
  },
  { versionKey: false }
);

AgreeCompanySchema.index({ topicId: 1, slug: 1 }, { unique: true });
AgreeCompanySchema.index({ topicId: 1, isActive: 1, name: 1 });

export const AgreeCompanyModel =
  (models.AgreeCompany as mongoose.Model<IAgreeCompany>) ||
  model<IAgreeCompany>("AgreeCompany", AgreeCompanySchema);

