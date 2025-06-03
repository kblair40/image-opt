"use server";

import sharp from "sharp";
import type {
  OutputInfo,
  // OutputOptions
  ResizeOptions,
} from "sharp";
import { imageSize } from "image-size";
import type { PercentCrop } from "react-image-crop";
import type { ISizeCalculationResult } from "image-size/types/interface";
import type { Channels } from "sharp";

import type { Dimensions } from "@/lib/image-types";
import { resizeImage as _resizeImage } from "@/lib/server-image-utils";
import type { OptimizedMetadata } from "./resizeImage";

// type OptMetadata = ISizeCalculationResult &
//   Omit<OutputInfo, "channels" | "premultiplied">;
// // export type OptimizedMetadata = {
// //   metadata: ISizeCalculationResult & OutputInfo;
// //   dataUrl: string;
// // };

// export type OptimizedMetadata = {
//   metadata: OptMetadata;
//   //   metadata: ISizeCalculationResult & OutputInfo;
//   dataUrl: string;
// };

export async function cropImage(
  dataUrl: string,
  crop: PercentCrop
): Promise<OptimizedMetadata | null> {
  try {
    const buf = Buffer.from(dataUrl.split(",")[1], "base64");
    const metadata = await imageSize(buf);
    console.log("metadata:", metadata);

    // if (!metadata.type) {
    //   return null;
    // }
    // const preMd = await sharp(buf).metadata();
    // console.log("\nPRE METADATA:", preMd, "\n");
    const left = Math.floor((crop.x / 100) * metadata.width);
    const top = Math.floor((crop.y / 100) * metadata.height);
    const width = Math.floor((crop.width / 100) * metadata.width);
    const height = Math.floor((crop.height / 100) * metadata.height);

    console.log("\nCROP CONFIG:", { left, top, width, height }, "\n");
    const img = sharp(buf).extract({
      left,
      top,
      width,
      height,
    });

    const bufOut = await img.toBuffer();

    const b64Url = bufOut.toString("base64");
    const mdOut = await imageSize(bufOut);

    const file: OutputInfo = await new Promise(async (resolve, reject) => {
      try {
        img.toFile("tmp", (err, info) => {
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
