import type { PixelCrop } from "react-image-crop";
import { centerCrop, makeAspectCrop } from "react-image-crop";

import type {
  AllowedImageFormat,
  Metadata,
  SerializedMetadata,
  BufferField,
} from "./image-types";

const BUFFER_FIELDS: BufferField[] = [
  "exif",
  "icc",
  "iptc",
  "xmp",
  "tifftagPhotoshop",
];

export function deserializeMetadata(serMetadata: SerializedMetadata): Metadata {
  const deserFields: any = {};
  for (const key of BUFFER_FIELDS) {
    if (serMetadata[key] !== undefined) {
      deserFields[key] = Buffer.from(serMetadata[key]);
    }
  }

  return { ...serMetadata, ...deserFields } as Metadata;
}

type GetCroppedImg = {
  image: HTMLImageElement;
  crop: PixelCrop;
  fmt: AllowedImageFormat;
  useExact?: boolean;
};
export function getCroppedImg({
  image,
  crop,
  fmt,
  useExact = false,
}: GetCroppedImg) {
  //   ): { dataUrl: string; metadata: Metadata } {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  console.log("Scale:", { scaleX, scaleY });

  const w = useExact ? crop.width : crop.width * scaleX;
  const h = useExact ? crop.height : crop.height * scaleY;
  // const w = crop.width * scaleX;
  // const h = crop.height * scaleY;
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(image, crop.x * scaleX, crop.y * scaleY, w, h, 0, 0, w, h);
  }

  return {
    //   dataUrl: canvas.toDataURL("image/png", 1.0),
    dataUrl: canvas.toDataURL(`image/${fmt}`, 1.0),
    metadata: { width: w, height: h, format: fmt },
    //   metadata: null,
  };
}

export function dataUrlPrefix(type: string) {
  return `data:image/${type};base64,`;
}

// NEW
const TO_RADIANS = Math.PI / 180;

export async function canvasPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: PixelCrop,
  scale = 1,
  rotate = 0
) {
  const ctx = canvas.getContext("2d");
  console.group("Canvas Preview");
  console.log({ ctx });

  if (!ctx) {
    throw new Error("No 2d context");
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  // devicePixelRatio slightly increases sharpness on retina devices
  // at the expense of slightly slower render times and needing to
  // size the image back down if you want to download/upload and be
  // true to the images natural size.
  const pixelRatio = window.devicePixelRatio;
  // const pixelRatio = 1

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  const rotateRads = rotate * TO_RADIANS;
  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  ctx.save();

  // 5) Move the crop origin to the canvas origin (0,0)
  ctx.translate(-cropX, -cropY);
  // 4) Move the origin to the center of the original position
  ctx.translate(centerX, centerY);
  // 3) Rotate around the origin
  ctx.rotate(rotateRads);
  // 2) Scale the image
  ctx.scale(scale, scale);
  // 1) Move the center of the image to the origin (0,0)
  ctx.translate(-centerX, -centerY);
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight
  );

  ctx.restore();

  console.groupEnd();
}

let previewUrl = "";

function toBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(resolve);
  });
}

// Returns an image source you should set to state and pass
// `{previewSrc && <img alt="Crop preview" src={previewSrc} />}`
export async function imgPreview(
  image: HTMLImageElement,
  crop: PixelCrop,
  scale = 1,
  rotate = 0
) {
  const canvas = document.createElement("canvas");
  canvasPreview(image, canvas, crop, scale, rotate);

  const blob = await toBlob(canvas);

  if (!blob) {
    console.error("Failed to create blob");
    return "";
  }

  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
  }

  previewUrl = URL.createObjectURL(blob);
  return previewUrl;
}

export function getSizeString(bytes?: number) {
  if (!bytes) return "?kb";
  const kb = bytes / 1000;

  return kb >= 1000 ? (kb / 1000).toFixed(1) + "mb" : kb.toFixed(1) + " kb";
}

export function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}
