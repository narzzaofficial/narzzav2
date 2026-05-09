import Parser from "rss-parser";

export interface RawArticle {
  title: string;
  sourceUrl: string;
  sourceTitle: string;
  content: string;
  pubDate?: string;
}

const parser = new Parser({
  customFields: {
    item: [["content:encoded", "contentEncoded"]],
  },
  timeout: 10000,
});

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

async function fetchSource(
  name: string,
  url: string
): Promise<RawArticle[]> {
  const feed = await parser.parseURL(url);
  return (feed.items ?? []).slice(0, 10).map((item) => {
    const raw =
      (item as unknown as Record<string, string>).contentEncoded ||
      item.content ||
      item.summary ||
      item.title ||
      "";
    return {
      title: item.title?.trim() ?? "",
      sourceUrl: item.link ?? item.guid ?? "",
      sourceTitle: name,
      content: stripHtml(raw),
      pubDate: item.pubDate ?? item.isoDate,
    };
  }).filter((a) => a.title && a.sourceUrl);
}

export async function fetchAllRSSArticles(
  sources: Array<{ name: string; url: string; enabled: boolean }>
): Promise<RawArticle[]> {
  const enabledSources = sources.filter((s) => s.enabled);
  const results = await Promise.allSettled(
    enabledSources.map((s) => fetchSource(s.name, s.url))
  );

  const articles: RawArticle[] = [];
  results.forEach((result, i) => {
    if (result.status === "fulfilled") {
      articles.push(...result.value);
    } else {
      console.error(`[rss-fetcher] Gagal fetch ${enabledSources[i].name}:`, result.reason);
    }
  });

  return articles;
}
