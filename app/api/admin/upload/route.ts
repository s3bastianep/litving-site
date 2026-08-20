import { writeFile } from "node:fs/promises";
import path from "node:path";
import { getAdminSessionFromRequest } from "../../../lib/admin-auth";
import { ensureUploadDir, uploadPublicUrl } from "../../../lib/upload-dir";

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB — fotos de alta calidad

export async function POST(request: Request) {
  if (!getAdminSessionFromRequest(request)) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json(
      { error: "No se pudo leer el archivo. Prueba subir una foto a la vez." },
      { status: 400 },
    );
  }

  const files = form.getAll("files").filter((item): item is File => item instanceof File);
  if (!files.length) {
    return Response.json({ error: "No se recibieron archivos." }, { status: 400 });
  }
  if (files.length > 1) {
    return Response.json(
      { error: "Sube una foto por solicitud; el panel lo hace automáticamente." },
      { status: 400 },
    );
  }

  let uploadDir: string;
  try {
    uploadDir = await ensureUploadDir();
  } catch {
    return Response.json(
      { error: "No se pudo preparar la carpeta de fotos. Revisa el Volume en Railway." },
      { status: 500 },
    );
  }

  const urls: string[] = [];

  for (const file of files) {
    const looksImage =
      file.type.startsWith("image/") || /\.(jpe?g|png|webp|gif|heic|heif)$/i.test(file.name || "");
    if (!looksImage) {
      return Response.json({ error: `Archivo no válido: ${file.name}` }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return Response.json(
        { error: `La imagen ${file.name} supera 25 MB. Reduce un poco el tamaño.` },
        { status: 400 },
      );
    }
    const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext) ? ext : "jpg";
    const name = `listing-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    try {
      await writeFile(path.join(uploadDir, name), buffer);
    } catch {
      return Response.json(
        { error: "No se pudo guardar la imagen en el disco. Revisa el Volume." },
        { status: 500 },
      );
    }
    urls.push(uploadPublicUrl(name));
  }

  return Response.json({ urls }, { status: 201 });
}
