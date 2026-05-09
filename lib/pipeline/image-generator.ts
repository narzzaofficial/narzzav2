import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateNewsImage(
  title: string,
  imageModel = "dall-e-3"
): Promise<string | null> {
  try {
    const prompt = `Bold editorial illustration for a news article titled: "${title.slice(0, 200)}". \
Vibrant Gen Z aesthetic — electric neon accents, rich saturated colors, high contrast, energetic composition. \
Conceptual and symbolic imagery representing the topic using objects, locations, flags, symbols, and environments. \
Do NOT depict any real or recognizable people, faces, or portraits. \
No text, no watermarks, modern digital art style, punchy and eye-catching.`;

    const response = await openai.images.generate({
      model: imageModel,
      prompt,
      size: "1792x1024",
      quality: "standard",
      n: 1,
    });

    return response.data?.[0]?.url ?? null;
  } catch (error) {
    console.error("[image-generator] Gagal generate gambar:", error);
    return null;
  }
}
