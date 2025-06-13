"use server";

import sharp from "sharp";

import type { Dimensions, SerializedMetadata } from "@/lib/image-types";
import { serializeMetadata } from "@/lib/server-image-utils";

export async function resizeImage(
  dataUrl: string,
  dims: Dimensions
): Promise<{ metadata: SerializedMetadata; dataUrl: string } | null> {
  try {
    console.log("\nresizeImage args:", { dataUrl, dims });
    const buf = Buffer.from(dataUrl.split(",")[1], "base64");
    const img = sharp(buf).resize(dims.width, dims.height);

    const bufOut = await img.toBuffer();
    const b64Url = bufOut.toString("base64");
    const mdOut = await img.metadata();
    console.log("\nb64Url:", b64Url);

    console.log("\n");
    // return serializeMetadata(mdOut)
    return {
      dataUrl: b64Url,
      metadata: serializeMetadata(mdOut),
    };
  } catch (e) {
    console.log("\nError extracting image metadata:", e, "\n");
    return null;
  }
}
