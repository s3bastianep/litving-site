import { writeFile } from "node:fs/promises";
import path from "node:path";
import { getAdminSessionFromRequest } from "../../../lib/admin-auth";
import { ensureUploadDir, uploadPublicUrl } from "../../../lib/upload-dir";

export async function POST(request: Request) {
  if (!getAdminSessionFromRequest(request)) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  const form = await request.formData();
  const files = form.getAll("files").filter((item): item is File => item instanceof File);
  if (!files.length) {
    return Response.json({ error: "No se recibieron archivos." }, { status: 400 });
  }

  let uploadDir: string;
  try {
    uploadDir = await ensureUploadDir();
  } catch {
    return Response.json(
      { error: "No se pudo preparar la carpeta de fotos (Volume / data/uploads)." },
      { status: 500 },
    );
  }

  const urls: string[] = [];

  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      return Response.json({ error: `Archivo no válido: ${file.name}` }, { status: 400 });
    }
    if (file.size > 8 * 1024 * 1024) {
      return Response.json({ error: `La imagen ${file.name} supera 8 MB.` }, { status: 400 });
    }
    const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext) ? ext : "jpg";
    const name = `listing-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    try {
      await writeFile(path.join(uploadDir, name), buffer);
    } catch {
      return Response.json(
        { error: "No se pudo guardar la imagen. Revisa el Volume en Railway." },
        { status: 500 },
      );
    }
    urls.push(uploadPublicUrl(name));
  }

  return Response.json({ urls }, { status: 201 });
}
