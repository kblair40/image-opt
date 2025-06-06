"use server";

import sharp from "sharp";
import type { OutputInfo, ResizeOptions } from "sharp";

import type {
  OutputOptions,
  AnyOutputOptions,
  AllowedImageFormat,
  OptimizedMetadata,
} from "@/lib/image-types";
import { resizeImage, serializeMetadata } from "@/lib/server-image-utils";

const DEFAULT_OUTPUT_OPTIONS: OutputOptions = {
  jpeg: {},
  jpg: {},
  png: {},
  webp: {},
  avif: {},
};

export async function compressImage(
  dataUrl: string,
  toType: AllowedImageFormat,
  options: {
    output: AnyOutputOptions;
    resize: ResizeOptions | null;
  } = { output: {}, resize: null }
): Promise<OptimizedMetadata | null> {
  const outputOptions = { ...DEFAULT_OUTPUT_OPTIONS[toType], ...options };
  try {
    const buf = Buffer.from(dataUrl.split(",")[1], "base64");

    let img = sharp(buf);
    const metadata = await img.metadata();
    console.log("metadata:", metadata);

    if (options.resize) {
      img = resizeImage(img, options.resize);
    }

    const imgOut = img.toFormat(toType, outputOptions);

    const bufOut = await imgOut.toBuffer();

    const b64Url = bufOut.toString("base64");
    const mdOut = await imgOut.metadata();

    const outputInfo: OutputInfo = await new Promise(
      async (resolve, reject) => {
        try {
          imgOut.toFile("tmp", (err, info) => {
            console.log("\nErr/Info:", { err, info }, "\n");
            resolve(info);
          });
        } catch (e) {
          console.log("\nError creating file:", e, "n");
          reject(e);
        }
      }
    );
    console.log("\noutputInfo:", outputInfo);

    console.log("\n");
    return { dataUrl: b64Url, metadata: serializeMetadata(mdOut), outputInfo };
  } catch (e) {
    console.log("\nError extracting image metadata:", e, "\n");
    return null;
  }
}
