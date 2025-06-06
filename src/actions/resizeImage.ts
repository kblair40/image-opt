"use server";

import sharp from "sharp";
import type { OutputInfo } from "sharp";

import type { Dimensions, OptimizedMetadata } from "@/lib/image-types";
import {
  resizeImage as _resizeImage,
  serializeMetadata,
} from "@/lib/server-image-utils";

export async function resizeImage(
  dataUrl: string,
  dims: Dimensions
): Promise<Omit<OptimizedMetadata, "outputInfo"> | null> {
  try {
    const buf = Buffer.from(dataUrl.split(",")[1], "base64");

    let img = sharp(buf);
    img = _resizeImage(img, dims);

    const bufOut = await img.toBuffer();
    const b64Url = bufOut.toString("base64");
    const mdOut = await img.metadata();

    console.log("\n");
    return {
      dataUrl: b64Url,
      metadata: serializeMetadata(mdOut),
    };
  } catch (e) {
    console.log("\nError extracting image metadata:", e, "\n");
    return null;
  }
}
