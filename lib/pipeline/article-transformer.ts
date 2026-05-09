import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import type { IChatLine } from "@/lib/models/Feed";
import type { RawArticle } from "./rss-fetcher";

export interface TransformResult {
  lines: IChatLine[];
  takeaway: string;
  imagePrompt: string;
}

const SYSTEM_PROMPT = `Kamu adalah editor berita senior untuk media digital Indonesia bernama Narzza.
Tugasmu mengubah artikel berita menjadi format tanya-jawab (Q&A) yang informatif, lengkap, dan mudah dipahami pembaca awam.
Jika artikel dalam bahasa Inggris atau bahasa lain, terjemahkan ke Bahasa Indonesia yang baku dan jelas.
Sesuaikan konteks agar relevan untuk pembaca Indonesia.

ATURAN WAJIB:
- JANGAN memotong atau meringkas informasi penting — semua detail, angka, nama, tanggal, dan fakta dari artikel HARUS masuk.
- Setiap jawaban harus lengkap dan tuntas, boleh panjang jika memang perlu — JANGAN dipotong di tengah.
- Jumlah pasang Q&A menyesuaikan panjang dan kompleksitas artikel: artikel pendek minimal 5 pasang, artikel panjang/kompleks bisa sampai 10–12 pasang.
- Setiap pertanyaan menggali satu aspek spesifik (siapa, apa, kapan, di mana, mengapa, bagaimana, dampaknya apa).
- Balas HANYA dengan JSON yang valid, tanpa markdown, tanpa komentar, tanpa penjelasan tambahan.`;

const USER_PROMPT = `Artikel dari {sourceTitle}:
JUDUL: {title}
ISI LENGKAP: {content}

Ubah artikel di atas menjadi Q&A yang LENGKAP dan TIDAK TERPOTONG dalam Bahasa Indonesia.
Jumlah pasang Q&A sesuaikan dengan isi artikel (minimal 5, maksimal 12).
Semua fakta, angka, nama, dan detail penting HARUS tercakup di salah satu jawaban.

Untuk imagePrompt: buat prompt Bahasa Inggris untuk DALL-E 3 yang menggambarkan cover artikel ini.
Gaya: bold editorial illustration, vibrant Gen Z colors, electric neon accents, high contrast.
JANGAN sertakan wajah atau orang nyata. Fokus ke simbol, objek, lokasi, dan konsep dari artikel.

Format JSON:
{{
  "lines": [
    {{"role": "q", "text": "Pertanyaan lengkap?"}},
    {{"role": "a", "text": "Jawaban lengkap dan tuntas tanpa dipotong."}},
    {{"role": "q", "text": "..."}},
    {{"role": "a", "text": "..."}}
  ],
  "takeaway": "Ringkasan 2-3 kalimat tentang dampak dan signifikansi berita ini bagi Indonesia.",
  "imagePrompt": "Bold editorial illustration for [topic], vibrant Gen Z aesthetic, electric neon accents, [specific symbols/objects/locations], no people, no text, punchy and eye-catching."
}}`;

const TUTORIAL_SYSTEM_PROMPT = `Kamu adalah instruktur dan content creator Indonesia yang ahli di bidang teknologi, digital, karier, keuangan, dan kehidupan sehari-hari.
Tugasmu membuat konten tutorial berkualitas tinggi dalam format tanya-jawab (Q&A) untuk media digital Narzza yang ditujukan untuk Gen Z Indonesia.

ATURAN WAJIB:
- Tulis dari pengetahuanmu sendiri — jangan minta artikel atau sumber eksternal.
- Setiap jawaban harus LENGKAP, praktis, dan actionable — berisi langkah nyata, contoh konkret, atau tips spesifik.
- Gunakan Bahasa Indonesia yang santai tapi tetap informatif — cocok untuk Gen Z.
- Jumlah Q&A: 6–10 pasang, sesuai kompleksitas topik.
- Pertanyaan harus mengalir logis: dari dasar (apa itu?) ke praktik (bagaimana cara?) ke tips lanjutan (apa yang harus dihindari?).
- Balas HANYA dengan JSON yang valid, tanpa markdown, tanpa komentar, tanpa penjelasan tambahan.`;

const TUTORIAL_USER_PROMPT = `Buat tutorial lengkap tentang topik berikut:
TOPIK: {topic}
LEVEL: {level}

Tulis tutorial ini sebagai konten Q&A yang informatif dan praktikal dalam Bahasa Indonesia untuk pembaca Gen Z.
Jumlah pasang Q&A: 6–10 pasang sesuai kebutuhan topik.

Untuk imagePrompt: buat prompt Bahasa Inggris untuk DALL-E 3 yang cocok sebagai cover tutorial ini.
Gaya: bold digital illustration, vibrant Gen Z aesthetic, electric neon accents, high contrast, tech/modern feel.
JANGAN ada wajah atau orang. Fokus ke ikon, simbol, interface, objek yang relevan dengan topik.

Format JSON:
{{
  "title": "Judul tutorial yang menarik dan SEO-friendly dalam Bahasa Indonesia",
  "lines": [
    {{"role": "q", "text": "Pertanyaan pertama?"}},
    {{"role": "a", "text": "Jawaban lengkap dengan contoh konkret."}},
    {{"role": "q", "text": "..."}},
    {{"role": "a", "text": "..."}}
  ],
  "takeaway": "Ringkasan 2-3 kalimat tentang apa yang pembaca bisa lakukan setelah membaca tutorial ini.",
  "imagePrompt": "Bold digital illustration for [topic] tutorial, vibrant Gen Z aesthetic, electric neon accents, [relevant icons/symbols], no people, no text, punchy and eye-catching."
}}`;

export async function generateTutorialFromTopic(
  topic: string,
  level: "pemula" | "menengah" | "lanjutan" = "pemula",
  modelName = "gpt-4o-mini"
): Promise<TransformResult & { title: string }> {
  const llm = new ChatOpenAI({
    model: modelName,
    temperature: 0.6,
    maxTokens: 4096,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", TUTORIAL_SYSTEM_PROMPT],
    ["human", TUTORIAL_USER_PROMPT],
  ]);

  const chain = prompt.pipe(llm).pipe(new JsonOutputParser());

  const result = await chain.invoke({ topic, level }) as TransformResult & { title: string };

  if (!Array.isArray(result.lines) || !result.takeaway || !result.title) {
    throw new Error("Format respons LLM tidak valid");
  }

  return result;
}

export async function transformArticleToQA(
  article: RawArticle,
  modelName = "gpt-4o-mini"
): Promise<TransformResult> {
  const llm = new ChatOpenAI({
    model: modelName,
    temperature: 0.3,
    maxTokens: 4096,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", SYSTEM_PROMPT],
    ["human", USER_PROMPT],
  ]);

  const chain = prompt.pipe(llm).pipe(new JsonOutputParser());

  const result = await chain.invoke({
    sourceTitle: article.sourceTitle,
    title: article.title,
    content: article.content.slice(0, 8000),
  }) as TransformResult;

  if (!Array.isArray(result.lines) || !result.takeaway) {
    throw new Error("Format respons LLM tidak valid");
  }

  return result;
}
