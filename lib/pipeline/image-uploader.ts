import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import sharp from "sharp";

const region = process.env.DO_SPACES_REGION || "sgp1";
const endpoint = process.env.DO_SPACES_ENDPOINT || `https://${region}.digitaloceanspaces.com`;
const bucket = process.env.DO_SPACES_BUCKET!;

const s3 = new S3Client({
  region,
  endpoint,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET!,
  },
});

export async function uploadImageFromUrl(
  imageUrl: string | null,
  fallbackTitle: string
): Promise<string> {
  if (!imageUrl) {
    return `https://picsum.photos/seed/${encodeURIComponent(fallbackTitle.slice(0, 30))}/800/450`;
  }

  try {
    const response = await fetch(imageUrl, {
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const rawBuffer = Buffer.from(await response.arrayBuffer());
    const webpBuffer = await sharp(rawBuffer).webp({ quality: 85 }).toBuffer();

    const key = `uploads/news/${Date.now()}-${randomUUID()}.webp`;

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: webpBuffer,
        ContentType: "image/webp",
        ACL: "public-read",
      })
    );

    return `https://${bucket}.${region}.digitaloceanspaces.com/${key}`;
  } catch (error) {
    console.error("[image-uploader] Gagal upload gambar, pakai fallback:", error);
    return `https://picsum.photos/seed/${encodeURIComponent(fallbackTitle.slice(0, 30))}/800/450`;
  }
}
