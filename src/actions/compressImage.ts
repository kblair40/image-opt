"use server";

import sharp from "sharp";
import type {
  OutputInfo,
  // OutputOptions
  ResizeOptions,
} from "sharp";
import { imageSize } from "image-size";
import type { ISizeCalculationResult } from "image-size/types/interface";

import type {
  OutputOptions,
  AnyOutputOptions,
  AllowedImageType,
} from "@/lib/image-types";
import { resizeImage } from "@/lib/image-utils";

export type OptimizedMetadata = {
  metadata: ISizeCalculationResult & OutputInfo;
  dataUrl: string;
};

const DEFAULT_OUTPUT_OPTIONS: OutputOptions = {
  jpeg: {},
  png: {},
  webp: {},
  avif: {},
};

export async function compressImage(
  dataUrl: string,
  toType: AllowedImageType,
  options: {
    output: AnyOutputOptions;
    resize: ResizeOptions | null;
  } = { output: {}, resize: null }
): Promise<OptimizedMetadata | null> {
  const outputOptions = { ...DEFAULT_OUTPUT_OPTIONS[toType], ...options };
  try {
    const buf = Buffer.from(dataUrl.split(",")[1], "base64");
    const metadata = await imageSize(buf);

    let img = sharp(buf);
    console.log("metadata:", metadata);
    if (options.resize) {
      img = resizeImage(img, options.resize);
    }
    
    const imgOut = img
      //   .resize(Math.round(x.width / 2), Math.round(x.height / 2))
      //   .png()
      .toFormat(toType, outputOptions);
    //   .toFormat(toType, {
    //     quality: 80,
    //   });

    const bufOut = await imgOut.toBuffer();

    const b64Url = bufOut.toString("base64");
    // const b64Url = bufOut.toString("base64url");
    const mdOut = await imageSize(bufOut);

    const file: OutputInfo = await new Promise(async (resolve, reject) => {
      try {
        imgOut.toFile("tmp", (err, info) => {
          console.log("\nErr/Info:", { err, info }, "\n");
          resolve(info);
        });
      } catch (e) {
        console.log("\nError creating file:", e, "n");
        reject(e);
      }
    });
    console.log("\nFile:", file);

    console.log("\n");
    return { dataUrl: b64Url, metadata: Object.assign(mdOut, file) };
    // return { dataUrl: b64Url, metadata: mdOut };
  } catch (e) {
    console.log("\nError extracting image metadata:", e, "\n");
    return null;
  }
}
