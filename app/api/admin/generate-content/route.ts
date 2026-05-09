import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiRequest } from "@/lib/auth";
import { transformArticleToQA, generateTutorialFromTopic } from "@/lib/pipeline/article-transformer";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

async function fetchArticleFromUrl(url: string): Promise<{ title: string; content: string; sourceTitle: string }> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; Narzza/1.0)" },
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) throw new Error(`Gagal fetch URL: HTTP ${res.status}`);

  const html = await res.text();

  // Ambil title dari og:title atau <title>
  const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)?.[1];
  const htmlTitle = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];
  const title = stripHtml(ogTitle || htmlTitle || "").replace(" | .*", "").trim();

  // Ambil nama site dari og:site_name atau domain
  const siteName = html.match(/<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i)?.[1];
  const domain = new URL(url).hostname.replace("www.", "");
  const sourceTitle = siteName || domain;

  // Ambil konten utama: coba article tag dulu, fallback ke body
  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const raw = articleMatch?.[1] || bodyMatch?.[1] || html;
  const content = stripHtml(raw).slice(0, 8000);

  return { title, content, sourceTitle };
}

export async function POST(req: NextRequest) {
  const authError = await requireAdminApiRequest();
  if (authError) return authError;

  const body = await req.json();
  const {
    url,
    text,
    topic,
    level,
    title: manualTitle,
    sourceTitle: manualSource,
  } = body as {
    url?: string;
    text?: string;
    topic?: string;
    level?: "pemula" | "menengah" | "lanjutan";
    title?: string;
    sourceTitle?: string;
  };

  if (!url && !text && !topic) {
    return NextResponse.json({ error: "Kirim url, text, atau topic" }, { status: 400 });
  }

  try {
    // ─── Mode: Generate tutorial dari topik ──────────────────────────
    if (topic) {
      const result = await generateTutorialFromTopic(topic, level ?? "pemula");
      return NextResponse.json({
        title: result.title,
        sourceTitle: "Narzza AI",
        sourceUrl: "",
        lines: result.lines,
        takeaway: result.takeaway,
        imagePrompt: result.imagePrompt,
      });
    }

    // ─── Mode: Transform artikel dari URL atau teks ───────────────────
    let article: { title: string; content: string; sourceTitle: string; sourceUrl: string };

    if (url) {
      const fetched = await fetchArticleFromUrl(url);
      article = {
        title: manualTitle || fetched.title,
        content: fetched.content,
        sourceTitle: manualSource || fetched.sourceTitle,
        sourceUrl: url,
      };
    } else {
      article = {
        title: manualTitle || "",
        content: text!,
        sourceTitle: manualSource || "Manual",
        sourceUrl: "",
      };
    }

    const result = await transformArticleToQA(article);

    return NextResponse.json({
      title: article.title,
      sourceTitle: article.sourceTitle,
      sourceUrl: article.sourceUrl,
      lines: result.lines,
      takeaway: result.takeaway,
      imagePrompt: result.imagePrompt,
    });
  } catch (error) {
    console.error("[generate-content] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generate gagal" },
      { status: 500 }
    );
  }
}
