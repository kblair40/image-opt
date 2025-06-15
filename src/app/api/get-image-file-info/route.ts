import fs from "fs";
import type { NextRequest } from "next/server";
import sharp, { type OutputInfo } from "sharp";

function getSizeString(bytes?: number) {
  if (!bytes) return "?kb";
  const kb = bytes / 1000;

  return kb >= 1000 ? (kb / 1000).toFixed(1) + "mb" : kb.toFixed(1) + " kb";
}

export async function POST(req: NextRequest) {
  const { dataUrl } = await req.json();
  console.log("\nDATA URL:", dataUrl, "\n");

  const img = sharp(Buffer.from(dataUrl.split(",")[1], "base64"));
  const md = await img.metadata();

  const { format } = md;
  const filename = `tmp.${format}`;

  const info = await img.toFile(filename);
  const file = fs.readFileSync(filename);
  // const stats = fs.statSync(filename);

  console.log("\nOUTPUT:", {
    info: { ...info, sizeStr: getSizeString(info.size) },
    file,
    // stats,
  });

  //   .toFile("tmp3");
  //   const data = await res.json();

  return Response.json(
    { ...info, sizeStr: getSizeString(info.size) },
    { status: 200 }
  );
}
