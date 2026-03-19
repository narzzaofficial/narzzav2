import mongoose, { model, models, Schema } from "mongoose";

import type { AgreeDocumentType } from "@/types/agree";

type QA = { role: "q" | "a"; text: string };

type Analysis = {
  summary: string[];
  agreedWithoutRealizing: string[];
  surprisingPoints: string[];
  dataCollected: string[];
  platformRights: string[];
  risks: string[];
  tips: string[];
};

export interface IAgreeDocument {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  appId: mongoose.Types.ObjectId;
  type: AgreeDocumentType;
  dek: string;
  tosOriginal: string;
  tosTranslation?: string;
  analysis: Analysis;
  content: QA[];
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

const ChatLineSchema = new Schema<QA>(
  {
    role: { type: String, enum: ["q", "a"], required: true },
    text: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const AnalysisSchema = new Schema<Analysis>(
  {
    summary: { type: [String], default: [] },
    agreedWithoutRealizing: { type: [String], default: [] },
    surprisingPoints: { type: [String], default: [] },
    dataCollected: { type: [String], default: [] },
    platformRights: { type: [String], default: [] },
    risks: { type: [String], default: [] },
    tips: { type: [String], default: [] },
  },
  { _id: false }
);

const AgreeDocumentSchema = new Schema<IAgreeDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    appId: { type: Schema.Types.ObjectId, ref: "AgreeApp", required: true, index: true },
    type: {
      type: String,
      enum: ["terms-of-service", "privacy-policy", "community-guidelines"],
      required: true,
    },
    dek: { type: String, default: "" },
    tosOriginal: { type: String, default: "" },
    tosTranslation: { type: String, default: "" },
    analysis: { type: AnalysisSchema, default: () => ({}) },
    content: { type: [ChatLineSchema], default: [] },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: Date.now },
  },
  { versionKey: false }
);

AgreeDocumentSchema.index({ appId: 1, slug: 1 }, { unique: true });
AgreeDocumentSchema.index({ appId: 1, isActive: 1, updatedAt: -1 });
AgreeDocumentSchema.index({ type: 1, updatedAt: -1 });

export const AgreeDocumentModel =
  (models.AgreeDocument as mongoose.Model<IAgreeDocument>) ||
  model<IAgreeDocument>("AgreeDocument", AgreeDocumentSchema);

