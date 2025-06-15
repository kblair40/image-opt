"use server";

import fs from "fs";
import sharp from "sharp";
import type { OutputInfo } from "sharp";

import type { SerializedMetadata } from "@/lib/image-types";
import { serializeMetadata } from "@/lib/server-image-utils";

function getSizeString(bytes?: number) {
  if (!bytes) return "?kb";
  const kb = bytes / 1000;

  return kb >= 1000 ? (kb / 1000).toFixed(1) + "mb" : kb.toFixed(1) + " kb";
}

// export async function getImageFile(
//   dataUrl: string,
//   isCropped = false
// ): Promise<{ file: File; outputInfo: OutputInfo } | null> {
//   console.group(isCropped ? "\nCROPPED" : "\nORIGINAL");
//   try {
//     // Original
//     const img = sharp(Buffer.from(dataUrl.split(",")[1], "base64"));
//     const md = await img.metadata();

//     if (!md) {
//       console.log("\nNo Metadata");
//       return null;
//     }

//     // New
//     const img2 = await sharp(Buffer.from(dataUrl.split(",")[1], "base64"))
//       .withMetadata()
//       .toFile("tmp2");

//     console.log("\nimg2:", img2, getSizeString(img2.size), "\n");

//     // const outputInfo: OutputInfo = await new Promise(
//     //   async (resolve, reject) => {
//     //     try {
//     //       img.toFile("tmp", (err, info) => {
//     //         console.log("\nErr/Info:", { err, info }, "\n");
//     //         resolve(info);
//     //       });
//     //     } catch (e) {
//     //       console.log("\nError creating file:", e, "n");
//     //       reject(e);
//     //     }
//     //   }
//     // );

//     console.groupEnd();
//   } catch (e) {
//     console.log("\nError extracting image metadata:", e, "\n");
//     console.groupEnd();
//     return null;
//   }
// }
