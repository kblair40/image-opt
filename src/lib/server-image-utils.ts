import sharp from "sharp";
import type { ResizeOptions } from "sharp";

import type { Metadata, SerializedMetadata } from "./image-types";

export function resizeImage(img: sharp.Sharp, options: ResizeOptions) {
  return img.resize(options);
}

export function serializeMetadata(md: Metadata): SerializedMetadata | null {
  return null;
}
