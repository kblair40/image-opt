import sharp from "sharp";
import type { ResizeOptions } from "sharp";

export function resizeImage(img: sharp.Sharp, options: ResizeOptions) {
  return img.resize(options);
}
