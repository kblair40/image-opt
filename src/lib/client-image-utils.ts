import type { PixelCrop } from "react-image-crop";
import type { AllowedImageFormat } from "./image-types";
// import type { FormatEnum } from "sharp";

type GetCroppedImg = {
  image: HTMLImageElement;
  crop: PixelCrop;
  fmt: AllowedImageFormat;
};
export function getCroppedImg({ image, crop, fmt }: GetCroppedImg) {
  //   ): { dataUrl: string; metadata: Metadata } {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  console.log("Scale:", { scaleX, scaleY });

  const w = crop.width * scaleX;
  const h = crop.height * scaleY;
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(image, crop.x * scaleX, crop.y * scaleY, w, h, 0, 0, w, h);
  }

  return {
    //   dataUrl: canvas.toDataURL("image/png", 1.0),
    dataUrl: canvas.toDataURL(`image/${fmt}`, 1.0),
    metadata: { width: w, height: h, format: fmt },
    //   metadata: null,
  };
}
