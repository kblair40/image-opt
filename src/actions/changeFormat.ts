"use server";

import sharp from "sharp";

import type { AllowedImageFormat, SerializedMetadata } from "@/lib/image-types";
import { serializeMetadata } from "@/lib/server-image-utils";

export async function changeFormat(
  dataUrl: string,
  type: AllowedImageFormat
): Promise<{ metadata: SerializedMetadata; dataUrl: string } | null> {
  try {
    console.log("\nchangeFormat args:", {
      dataUrl: dataUrl.slice(0, 200),
      type,
    });
    const buf = Buffer.from(dataUrl.split(",")[1], "base64");
    const img = sharp(buf).toFormat(type, { quality: 100 });

    const bufOut = await img.toBuffer();
    const b64Url = bufOut.toString("base64");
    const mdOut = await img.metadata();
    console.log("\nb64Url:", b64Url.slice(0, 200));

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
