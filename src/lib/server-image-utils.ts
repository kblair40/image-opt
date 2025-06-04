import sharp from "sharp";
import type { ResizeOptions } from "sharp";

import type { Metadata, SerializedMetadata, BufferField } from "./image-types";

export function resizeImage(img: sharp.Sharp, options: ResizeOptions) {
  return img.resize(options);
}

const BUFFER_FIELDS: BufferField[] = [
  "exif",
  "icc",
  "iptc",
  "xmp",
  "tifftagPhotoshop",
];

export function serializeMetadata(md: Metadata): SerializedMetadata {
  const serFields: any = {};
  for (const key of BUFFER_FIELDS) {
    if (md[key] !== undefined) {
      serFields[key] = md[key].toString();
    }
  }

  return { ...md, ...serFields } as SerializedMetadata;
}
