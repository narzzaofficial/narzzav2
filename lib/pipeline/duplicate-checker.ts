import { FeedModel } from "@/lib/models/Feed";
import type { RawArticle } from "./rss-fetcher";

export async function filterNewArticles(articles: RawArticle[]): Promise<RawArticle[]> {
  if (articles.length === 0) return [];

  const urls = articles.map((a) => a.sourceUrl).filter(Boolean);
  const existing = await FeedModel.find(
    { "source.url": { $in: urls } },
    { "source.url": 1 }
  ).lean();

  const existingUrls = new Set(existing.map((f) => f.source?.url).filter(Boolean));
  return articles.filter((a) => !existingUrls.has(a.sourceUrl));
}
