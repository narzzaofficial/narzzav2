import mongoose, { model, models, Schema } from "mongoose";

import type { ChatLine } from "@/types/content";

export type LawStatus = "Berlaku" | "Diubah" | "Dicabut";
export type LawCategory =
  | "Pidana"
  | "Perdata"
  | "Ketenagakerjaan"
  | "Bisnis"
  | "Pajak"
  | "Pertanahan"
  | "Keluarga"
  | "Konsumen"
  | "Siber"
  | "LaluLintas";

export interface ILawDoc {
  id: number;
  slug: string;
  title: string;
  category: LawCategory;
  summary: string;
  originalText: string;
  explanationLines: ChatLine[];
  number: string;
  year: number;
  enactedAt: number;
  promulgatedAt: number;
  effectiveAt?: number;
  status: LawStatus;
  source: {
    institution: string;
    originalUrl: string;
    pdfUrl?: string;
  };
  storyId?: number | null;
  createdAt: number;
}

const ChatLineSchema = new Schema<ChatLine>(
  {
    role: { type: String, enum: ["q", "a"], required: true },
    text: { type: String, required: true },
    image: { type: String },
  },
  { _id: false }
);

const LawDocSchema = new Schema<ILawDoc>(
  {
    id: { type: Number, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "Pidana",
        "Perdata",
        "Ketenagakerjaan",
        "Bisnis",
        "Pajak",
        "Pertanahan",
        "Keluarga",
        "Konsumen",
        "Siber",
        "LaluLintas",
      ],
      required: true,
    },
    summary: { type: String, default: "" },
    originalText: { type: String, required: true },
    explanationLines: { type: [ChatLineSchema], default: [] },
    number: { type: String, required: true },
    year: { type: Number, required: true },
    enactedAt: { type: Number, required: true },
    promulgatedAt: { type: Number, required: true },
    effectiveAt: { type: Number },
    status: {
      type: String,
      enum: ["Berlaku", "Diubah", "Dicabut"],
      default: "Berlaku",
    },
    source: {
      type: new Schema(
        {
          institution: { type: String, required: true },
          originalUrl: { type: String, required: true },
          pdfUrl: { type: String },
        },
        { _id: false }
      ),
      required: true,
    },
    storyId: { type: Number, default: null },
    createdAt: { type: Number, default: Date.now },
  },
  { versionKey: false }
);

LawDocSchema.index({ category: 1, promulgatedAt: -1 });
LawDocSchema.index({ number: 1, year: 1 }, { unique: true });
LawDocSchema.index({ title: "text", summary: "text", originalText: "text" });

export const LawDocModel =
  (models.LawDoc as mongoose.Model<ILawDoc>) ||
  model<ILawDoc>("LawDoc", LawDocSchema);
