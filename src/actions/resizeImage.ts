"use server";

import sharp from "sharp";
import type {
  OutputInfo,
  // OutputOptions
  ResizeOptions,
} from "sharp";
import { imageSize } from "image-size";
import type { ISizeCalculationResult } from "image-size/types/interface";

import type { Dimensions } from "@/lib/image-types";
import { resizeImage as _resizeImage } from "@/lib/image-utils";

// Original
// export type OptimizedMetadata = {
//   metadata: ISizeCalculationResult & OutputInfo;
//   dataUrl: string;
// };

// Makes channels, premultiplied and size keys optional
type OptionalMetadata = Omit<
  OutputInfo,
  "channels" | "premultiplied" | "size"
> &
  Partial<Pick<OutputInfo, "channels" | "premultiplied" | "size">>;

export type OptimizedMetadata = {
  metadata: ISizeCalculationResult & OptionalMetadata;
  dataUrl: string;
};

export async function resizeImage(
  dataUrl: string,
  dims: Dimensions
): Promise<OptimizedMetadata | null> {
  try {
    const buf = Buffer.from(dataUrl.split(",")[1], "base64");
    const metadata = await imageSize(buf);
    console.log("metadata:", metadata);

    if (!metadata.type) {
      return null;
    }

    let img = sharp(buf);
    img = _resizeImage(img, dims);

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
