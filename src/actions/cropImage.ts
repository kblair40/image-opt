"use server";

import sharp from "sharp";
import type { OutputInfo, ResizeOptions } from "sharp";
import type { PercentCrop } from "react-image-crop";

import { resizeImage } from "@/lib/server-image-utils";

import type { OptimizedMetadata, AnyOutputOptions } from "@/lib/image-types";

export async function cropImage(
  dataUrl: string,
  crop: PercentCrop,
  options: {
    output?: AnyOutputOptions;
    resize?: ResizeOptions;
  } = {}
): Promise<OptimizedMetadata | null> {
  try {
    const buf = Buffer.from(dataUrl.split(",")[1], "base64");

    let img = sharp(buf);
    if (options.resize) {
      img = resizeImage(img, options.resize);
    }

    let metadata = await img.metadata();
    console.log("metadata:", metadata);

    const { format } = metadata;
    img = img.toFormat(format, options.output);

    metadata = await img.metadata();

    const left = Math.floor((crop.x / 100) * metadata.width);
    const top = Math.floor((crop.y / 100) * metadata.height);
    const width = Math.floor((crop.width / 100) * metadata.width);
    const height = Math.floor((crop.height / 100) * metadata.height);

    console.log("\nCROP CONFIG:", { left, top, width, height }, "\n");
    const croppedImg = img.extract({
      left,
      top,
      width,
      height,
    });

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
    console.log("\nOutput Info/Metadata Out:", { outputInfo, mdOut }, "\n");

    return { dataUrl: b64Url, metadata: mdOut, outputInfo };
  } catch (e) {
    console.log("\nError extracting image metadata:", e, "\n");
    return null;
  }
}
