import { readFile } from "node:fs/promises";
import path from "node:path";
import { getMediaAsset } from "../../../lib/media-store";
import { getUploadDir } from "../../../lib/upload-dir";

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

type Ctx = { params: Promise<{ name: string }> };

export async function GET(_request: Request, context: Ctx) {
  const { name: raw } = await context.params;
  const name = decodeURIComponent(raw || "").replace(/[/\\]/g, "");
  if (!name || name.includes("..")) {
    return new Response("Not found", { status: 404 });
  }

  const id = name.replace(/\.(jpe?g|png|webp|gif)$/i, "");
  try {
    const fromDb = await getMediaAsset(id);
    if (fromDb) {
      return new Response(new Uint8Array(fromDb.bytes), {
        status: 200,
        headers: {
          "Content-Type": fromDb.contentType || "image/jpeg",
          "Cache-Control": "public, max-age=86400",
        },
      });
    }
  } catch {
    /* fall through to disk */
  }

  try {
    const filePath = path.join(getUploadDir(), name);
    const data = await readFile(filePath);
    const ext = name.split(".").pop()?.toLowerCase() || "jpg";
    return new Response(new Uint8Array(data), {
      status: 200,
      headers: {
        "Content-Type": MIME[ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
