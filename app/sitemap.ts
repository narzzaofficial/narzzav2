import type { MetadataRoute } from "next";

import { getAllFeeds } from "@/lib/feeds";
import { getAllLaws } from "@/lib/laws";
import { getAllAgreeDocumentPaths } from "@/lib/setelah-klik-agree";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [feeds, laws, agreePaths] = await Promise.all([
    getAllFeeds(),
    getAllLaws(),
    getAllAgreeDocumentPaths(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/berita",
    "/tutorial",
    "/riset",
    "/hukum-indonesia",
    "/setelah-klik-agree",
    "/tentang",
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.8,
  }));

  const feedRoutes: MetadataRoute.Sitemap = feeds.map((feed) => ({
    url: absoluteUrl(`/feeds/${feed.slug}`),
    lastModified: new Date(feed.createdAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const lawRoutes: MetadataRoute.Sitemap = laws.map((law) => ({
    url: absoluteUrl(`/hukum/${law.slug}`),
    lastModified: new Date(law.createdAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const agreeRoutes: MetadataRoute.Sitemap = agreePaths.map((path) => ({
    url: absoluteUrl(
      `/setelah-klik-agree/${path.topic}/${path.company}/${path.app}/${path.document}`
    ),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.65,
  }));

  return [...staticRoutes, ...feedRoutes, ...lawRoutes, ...agreeRoutes];
}
