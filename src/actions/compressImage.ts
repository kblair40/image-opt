"use server";

import { imageSize } from "image-size";
import sharp from "sharp";
// import { Sharp } from "sharp";

import { AllowedImageType } from "@/lib/image-types";

export async function compressImage(
  dataUrl: string,
  fromType?: AllowedImageType,
  toType?: AllowedImageType
): Promise<any> {
  try {
    const buf = Buffer.from(dataUrl.split(",")[1], "base64");
    const metadata = await imageSize(buf);

    const img = sharp(buf);
    const x = await img.metadata();
    console.log("x-metadata:", metadata);
    return img
        .resize(Math.round(x.width / 2), Math.round(x.height / 2))
        .png()
        .toBuffer()

  } catch (e) {
    console.log("\nError extracting image metadata:", e, "\n");
    return null;
  }
}
