"use server";

import sharp from "sharp";

export async function getImageMetadata(
  dataUrl: string
): Promise<sharp.Metadata | null> {
  try {
    const img = sharp(Buffer.from(dataUrl.split(",")[1], "base64"));
    const metadata = await img.metadata();

    return metadata;
  } catch (e) {
    console.log("\nError extracting image metadata:", e, "\n");
    return null;
  }
}
