import fs from "fs";
import type { NextRequest } from "next/server";
import sharp, { type OutputInfo } from "sharp";

function getSizeString(bytes?: number) {
  if (!bytes) return "?kb";
  const kb = bytes / 1000;

  return kb >= 1000 ? (kb / 1000).toFixed(1) + "mb" : kb.toFixed(1) + " kb";
}

const outputs: Record<
  string,
  { inputSize: number; size: number; sizeStr: string }
> = {};

export async function POST(req: NextRequest) {
  const { dataUrl, isOriginal } = await req.json();
  console.log("\nDATA URL:", isOriginal, "\n");

  const img = sharp(Buffer.from(dataUrl.split(",")[1], "base64"));

  // const img = sharp(
  //   Buffer.from(dataUrl.split(",")[1], "base64")
  // ).withMetadata();
  const md = await img.metadata();
  // console.log("\nInitial metadata:", md, "\n");
  // if (md?.size) {
  //   console.log(
  //     "\nImg:",
  //     JSON.stringify({ size: md.size, fmt: md.format }, null, 2),
  //     "\n"
  //   );
  // }

  const { format } = md;
  const filename = `${isOriginal ? "orig-" : ""}tmp.${format}`;

  const info = await img.toFile(filename);
  const file = fs.readFileSync(filename);
  const stats = fs.statSync(filename);

  outputs[filename] = {
    inputSize: md.size!,
    size: stats.size,
    sizeStr: getSizeString(stats.size),
  };
  // console.log(
  //   "\nSTATS:",
  //   { ...stats, sizeStr: getSizeString(stats.size) },
  //   "\n"
  // );

  console.log("\nOutputs:", JSON.stringify(outputs, null, 2), "\n");

  // console.log("\nOUTPUT:", {
  //   info: { ...info, sizeStr: getSizeString(info.size) },
  //   file,
  //   filesize: stats.size,
  //   filesizeStr: getSizeString(stats.size),
  //   // stats,
  // });

  //   .toFile("tmp3");
  //   const data = await res.json();

  return Response.json(
    { ...info, sizeStr: getSizeString(info.size) },
    { status: 200 }
  );
}
