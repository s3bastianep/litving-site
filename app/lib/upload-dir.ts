import { mkdir } from "node:fs/promises";
import path from "node:path";

/** Railway Volume mount, or local ./data/uploads for development. */
export function getUploadDir() {
  const fromEnv = process.env.RAILWAY_VOLUME_MOUNT_PATH?.trim() || process.env.UPLOAD_DIR?.trim();
  if (fromEnv) return fromEnv;
  return path.join(process.cwd(), "data", "uploads");
}

export async function ensureUploadDir() {
  const dir = getUploadDir();
  await mkdir(dir, { recursive: true });
  return dir;
}

export function uploadPublicUrl(filename: string) {
  return `/api/uploads/${encodeURIComponent(filename)}`;
}
