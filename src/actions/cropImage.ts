"use server";

import sharp from "sharp";
import type { OutputInfo } from "sharp";
import type { PercentCrop, PixelCrop } from "react-image-crop";

import { serializeMetadata } from "@/lib/server-image-utils";

import type { OptimizedMetadata, AnyOutputOptions } from "@/lib/image-types";

export async function cropImage(
  dataUrl: string,
  crop: PercentCrop | PixelCrop,
  // crop: PercentCrop,
  options: {
    output?: AnyOutputOptions;
  } = {}
): Promise<OptimizedMetadata | null> {
  console.log("\nCrop Image Options:", options);
  try {
    const buf = Buffer.from(dataUrl.split(",")[1], "base64");

    const img = sharp(buf);

    const metadata = await img.metadata();
    const size = ((metadata.size || 1) / 1000 / 1000).toFixed(1);
    console.log("\nInitial metadata:", metadata, { size });

    let left: number;
    let top: number;
    let width: number;
    let height: number;

    if (crop.unit === "%") {
      console.log("\n% Crop:", crop);
      left = Math.floor((crop.x / 100) * metadata.width);
      top = Math.floor((crop.y / 100) * metadata.height);
      width = Math.floor((crop.width / 100) * metadata.width);
      height = Math.floor((crop.height / 100) * metadata.height);
    } else {
      console.log("\nPX Crop:", crop);
      left = Math.floor(crop.x);
      top = Math.floor(crop.y);
      width = Math.floor(crop.width);
      height = Math.floor(crop.height);
    }

    console.log("\nCROP CONFIG:", { left, top, width, height }, "\n");
    let croppedImg = img.extract({
      left,
      top,
      width,
      height,
    });

    croppedImg = croppedImg.toFormat(metadata.format, options.output);

    console.log("\nCropped Image:", {
      metadata: await croppedImg.metadata(),
    });

    try {
      const bufOut = await croppedImg.toBuffer();
      console.log("\nBuffer created\n");
    } catch (e) {
      console.log("\nErr creating buffer:", e, "\n");
    }

    const bufOut = await croppedImg.toBuffer();

    const b64Url = bufOut.toString("base64");
    const mdOut = await croppedImg.metadata();

    const outputInfo: OutputInfo = await new Promise(
      async (resolve, reject) => {
        try {
          img.toFile("tmp", (err, info) => {
            console.log("\nErr/Info:", { err, info }, "\n");
            resolve(info);
          });
        } catch (e) {
          console.log("\nError creating file:", e, "n");
          reject(e);
        }
      }
    );
    const sizeOut = ((mdOut.size || 0) / 1000 / 1000).toFixed(2);
    console.log("\noutputInfo/mdOut:", { outputInfo, mdOut, sizeOut }, "\n");

    const urlPrefix = `data:image/${mdOut.format};base64,`;

    return {
      dataUrl: urlPrefix + b64Url,
      metadata: serializeMetadata(mdOut),
      outputInfo,
    };
  } catch (e) {
    console.log("\nError extracting image metadata:", e, "\n");
    return null;
  }
}
