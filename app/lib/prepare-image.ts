/** Prepare listing photos for upload: keep quality high but under Railway body limits. */

const TARGET_MAX_BYTES = 3.5 * 1024 * 1024;
const MAX_EDGE = 2560;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`No se pudo leer “${file.name}”.`));
    };
    img.src = url;
  });
}

async function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (!blob) reject(new Error("No se pudo comprimir la imagen."));
        else resolve(blob);
      },
      "image/jpeg",
      quality,
    );
  });
}

/**
 * Returns a JPEG File ready to upload. If the original is already small enough
 * and is jpeg/png/webp, it may be returned as-is.
 */
export async function prepareImageForUpload(file: File): Promise<File> {
  if (file.size <= TARGET_MAX_BYTES && /image\/(jpeg|png|webp)/i.test(file.type)) {
    return file;
  }

  const img = await loadImage(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(img, 0, 0, width, height);

  let quality = 0.92;
  let blob = await canvasToBlob(canvas, quality);
  while (blob.size > TARGET_MAX_BYTES && quality > 0.72) {
    quality -= 0.06;
    blob = await canvasToBlob(canvas, quality);
  }

  const base = file.name.replace(/\.[^.]+$/, "") || "foto";
  return new File([blob], `${base}.jpg`, { type: "image/jpeg", lastModified: Date.now() });
}
