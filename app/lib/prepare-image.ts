/** Prepare listing photos for upload: always JPEG under a Railway-safe size. */

const TARGET_MAX_BYTES = 1.2 * 1024 * 1024;
const MAX_EDGE = 1920;

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

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

/** Always returns a compressed JPEG File. */
export async function prepareImageForUpload(file: File): Promise<File> {
  const img = await loadImage(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height || 1));
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error(`No se pudo procesar “${file.name}”.`);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  let quality = 0.88;
  let blob = await canvasToBlob(canvas, quality);
  while (blob.size > TARGET_MAX_BYTES && quality > 0.55) {
    quality -= 0.07;
    blob = await canvasToBlob(canvas, quality);
  }

  const base = file.name.replace(/\.[^.]+$/, "") || "foto";
  return new File([blob], `${base}.jpg`, { type: "image/jpeg", lastModified: Date.now() });
}

export async function fileToBase64Payload(file: File) {
  const buffer = new Uint8Array(await file.arrayBuffer());
  return {
    filename: file.name,
    contentType: file.type || "image/jpeg",
    dataBase64: bytesToBase64(buffer),
  };
}
