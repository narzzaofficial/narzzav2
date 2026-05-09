import { connectDB } from "@/lib/mongodb";
import { PipelineConfigModel, DEFAULT_PIPELINE_CONFIG } from "@/lib/models/PipelineConfig";
import { fetchAllRSSArticles } from "./rss-fetcher";
import { filterNewArticles } from "./duplicate-checker";
import { transformArticleToQA } from "./article-transformer";
import { generateNewsImage } from "./image-generator";
import { uploadImageFromUrl } from "./image-uploader";
import { createFeedDirectly } from "./feed-creator";

export interface PipelineResult {
  processed: number;
  created: number;
  skipped: number;
  failed: number;
  errors: string[];
  newFeedIds: number[];
}

export async function runNewsPipeline(): Promise<PipelineResult> {
  await connectDB();

  // Ambil config dari DB, fallback ke default
  const dbConfig = await PipelineConfigModel.findOne({}).lean();
  const config = dbConfig ?? DEFAULT_PIPELINE_CONFIG;

  const result: PipelineResult = {
    processed: 0,
    created: 0,
    skipped: 0,
    failed: 0,
    errors: [],
    newFeedIds: [],
  };

  console.log("[pipeline] Mulai fetch RSS...");
  const allArticles = await fetchAllRSSArticles(config.sources);
  console.log(`[pipeline] Total artikel dari RSS: ${allArticles.length}`);

  const newArticles = await filterNewArticles(allArticles);
  result.skipped = allArticles.length - newArticles.length;
  console.log(`[pipeline] Artikel baru (bukan duplikat): ${newArticles.length}`);

  const toProcess = newArticles.slice(0, config.articlesPerRun);
  result.processed = toProcess.length;

  for (const article of toProcess) {
    console.log(`[pipeline] Proses: "${article.title.slice(0, 60)}..."`);
    try {
      const [imageUrl, transformed] = await Promise.all([
        generateNewsImage(article.title, config.imageModel),
        transformArticleToQA(article, config.textModel),
      ]);

      const finalImageUrl = await uploadImageFromUrl(imageUrl, article.title);

      const feedId = await createFeedDirectly({
        title: article.title,
        category: "Berita",
        image: finalImageUrl,
        lines: transformed.lines,
        takeaway: transformed.takeaway,
        sourceTitle: article.sourceTitle,
        sourceUrl: article.sourceUrl,
      });

      result.created++;
      result.newFeedIds.push(feedId);
      console.log(`[pipeline] ✓ Feed #${feedId} dibuat`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      result.failed++;
      result.errors.push(`"${article.title.slice(0, 50)}": ${msg}`);
      console.error(`[pipeline] ✗ Gagal proses artikel: ${msg}`);
    }
  }

  console.log(`[pipeline] Selesai. Dibuat: ${result.created}, Gagal: ${result.failed}`);
  return result;
}
