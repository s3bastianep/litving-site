import { getAdminSessionFromRequest } from "../../../lib/admin-auth";
import { hasDatabaseUrl } from "../../../db";
import { saveMediaAsset } from "../../../lib/media-store";
import { ensureUploadDir, uploadPublicUrl } from "../../../lib/upload-dir";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const MAX_BYTES = 4 * 1024 * 1024;

function makeId() {
  return `img-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function POST(request: Request) {
  try {
    if (!getAdminSessionFromRequest(request)) {
      return Response.json({ error: "No autorizado." }, { status: 401 });
    }

    const contentType = request.headers.get("content-type") || "";
    let bytes: Buffer;
    let mime = "image/jpeg";
    let ext = "jpg";

    if (contentType.includes("application/json")) {
      const body = (await request.json()) as {
        dataBase64?: string;
        filename?: string;
        contentType?: string;
      };
      if (!body.dataBase64) {
        return Response.json({ error: "Falta la imagen (dataBase64)." }, { status: 400 });
      }
      bytes = Buffer.from(body.dataBase64, "base64");
      mime = body.contentType || "image/jpeg";
      const nameExt = body.filename?.split(".").pop()?.toLowerCase();
      if (nameExt && ["jpg", "jpeg", "png", "webp", "gif"].includes(nameExt)) {
        ext = nameExt === "jpeg" ? "jpg" : nameExt;
      } else if (mime.includes("png")) ext = "png";
      else if (mime.includes("webp")) ext = "webp";
      else ext = "jpg";
    } else {
      const form = await request.formData();
      const file = form.get("files");
      if (!(file instanceof File)) {
        return Response.json({ error: "No se recibieron archivos." }, { status: 400 });
      }
      bytes = Buffer.from(await file.arrayBuffer());
      mime = file.type || "image/jpeg";
      const nameExt = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      ext = ["jpg", "jpeg", "png", "webp", "gif"].includes(nameExt)
        ? nameExt === "jpeg"
          ? "jpg"
          : nameExt
        : "jpg";
    }

    if (bytes.length > MAX_BYTES) {
      return Response.json(
        { error: "La imagen sigue siendo muy grande después de optimizar. Prueba otra." },
        { status: 400 },
      );
    }
    if (bytes.length < 32) {
      return Response.json({ error: "Archivo de imagen vacío o inválido." }, { status: 400 });
    }

    const id = makeId();
    const filename = `${id}.${ext}`;

    if (hasDatabaseUrl()) {
      await saveMediaAsset({ id, contentType: mime, bytes });
    } else {
      const uploadDir = await ensureUploadDir();
      await writeFile(path.join(uploadDir, filename), bytes);
    }

    return Response.json({ urls: [uploadPublicUrl(filename)] }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al subir la imagen.";
    return Response.json({ error: message }, { status: 500 });
  }
}
