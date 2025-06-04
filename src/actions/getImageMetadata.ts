"use server";

import sharp from "sharp";

import type { SerializedMetadata } from "@/lib/image-types";
import { serializeMetadata } from "@/lib/server-image-utils";

export async function getImageMetadata(
  dataUrl: string
): Promise<SerializedMetadata | null> {
  try {
    const img = sharp(Buffer.from(dataUrl.split(",")[1], "base64"));
    const metadata = await img.metadata();

    return serializeMetadata(metadata);
  } catch (e) {
    console.log("\nError extracting image metadata:", e, "\n");
    return null;
  }
}
