import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accessKeyId = process.env.DO_SPACES_KEY;
const secretAccessKey = process.env.DO_SPACES_SECRET;
const bucket = process.env.DO_SPACES_BUCKET;
const region = process.env.DO_SPACES_REGION || "sgp1";
const endpoint =
  process.env.DO_SPACES_ENDPOINT || `https://${region}.digitaloceanspaces.com`;

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "-");
}

export async function POST(req: NextRequest) {
  try {
    if (!accessKeyId || !secretAccessKey || !bucket) {
      return NextResponse.json(
        {
          error:
            "DO Spaces config missing. Set DO_SPACES_KEY, DO_SPACES_SECRET, DO_SPACES_BUCKET.",
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const filename = String(body?.filename ?? "").trim();
    const contentType = String(body?.contentType ?? "").trim();

    if (!filename || !contentType.startsWith("image/")) {
      return NextResponse.json(
        { error: "filename dan contentType image/* wajib diisi." },
        { status: 400 }
      );
    }

    const client = new S3Client({
      region,
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
    });

    const key = `uploads/agree/${Date.now()}-${randomUUID()}-${sanitizeFilename(
      filename
    )}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
      ACL: "public-read",
    });

    const presignedUrl = await getSignedUrl(client, command, { expiresIn: 60 });
    const publicUrl = `https://${bucket}.${region}.digitaloceanspaces.com/${key}`;

    return NextResponse.json({ presignedUrl, publicUrl, key });
  } catch (error) {
    console.error("POST /api/upload/presigned-url error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

