import mongoose, { Schema, model, models } from "mongoose";

export interface IRSSSource {
  name: string;
  url: string;
  enabled: boolean;
}

export interface IPipelineConfig {
  _id?: string;
  textModel: string;
  imageModel: string;
  articlesPerRun: number;
  sources: IRSSSource[];
  updatedAt: number;
}

const RSSSourceSchema = new Schema<IRSSSource>(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const PipelineConfigSchema = new Schema<IPipelineConfig>(
  {
    textModel: { type: String, default: "gpt-4o-mini" },
    imageModel: { type: String, default: "dall-e-3" },
    articlesPerRun: { type: Number, default: 5, min: 1, max: 20 },
    sources: { type: [RSSSourceSchema], default: [] },
    updatedAt: { type: Number, default: Date.now },
  },
  { versionKey: false }
);

export const PipelineConfigModel =
  (models.PipelineConfig as mongoose.Model<IPipelineConfig>) ||
  model<IPipelineConfig>("PipelineConfig", PipelineConfigSchema);

// Default config jika belum ada di DB
export const DEFAULT_PIPELINE_CONFIG: Omit<IPipelineConfig, "_id"> = {
  textModel: "gpt-4o-mini",
  imageModel: "dall-e-3",
  articlesPerRun: 5,
  updatedAt: 0,
  sources: [
    { name: "Antara News", url: "https://www.antaranews.com/rss/terkini.rss", enabled: true },
    { name: "Setkab RI", url: "https://setkab.go.id/feed/", enabled: true },
    { name: "VOA Indonesia", url: "https://www.voaindonesia.com/api/zqqoyve$qt", enabled: true },
    { name: "BBC Indonesia", url: "https://feeds.bbci.co.uk/indonesia/rss.xml", enabled: true },
    { name: "DW Indonesia", url: "https://rss.dw.com/xml/rss-id-all", enabled: true },
    { name: "Reuters", url: "https://feeds.reuters.com/reuters/topNews", enabled: false },
    { name: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml", enabled: false },
  ],
};
