"use server";

import { imageSize } from "image-size";
import type { ISizeCalculationResult } from "image-size/types/interface";

export async function getImageMetadata(
  dataUrl: string
): Promise<ISizeCalculationResult | null> {
  try {
    const buf = Buffer.from(dataUrl.split(",")[1], "base64");
    const metadata = await imageSize(buf);
    console.log("\nmetadata:", metadata);

    return metadata;
  } catch (e) {
    console.log("\nError extracting image metadata:", e, "\n");
    return null;
  }
}
