import sharp from "sharp";
import type {
  JpegOptions,
  PngOptions,
  WebpOptions,
  AvifOptions,
  ResizeOptions,
  FormatEnum,
  OutputInfo,
} from "sharp";

import { getCroppedImg } from "./client-image-utils";

export type Metadata = sharp.Metadata;

export type CroppedImage = ReturnType<typeof getCroppedImg>;

export type AllowedImageFormat = keyof Pick<
  FormatEnum,
  "jpeg" | "jpg" | "png" | "avif" | "webp"
>;

export type AnyOutputOptions =
  | JpegOptions
  | PngOptions
  | WebpOptions
  | AvifOptions;
export interface OutputOptions {
  jpeg: JpegOptions;
  jpg: JpegOptions;
  png: PngOptions;
  webp: WebpOptions;
  avif: AvifOptions;
}

// export type Dimensions = { width: number; height: number };
export type Dimensions = Required<Pick<ResizeOptions, "width" | "height">>;

export type OptimizedMetadata = {
  metadata: Metadata;
  outputInfo: OutputInfo;
  dataUrl: string;
};

export type BufferField = keyof Pick<
  Metadata,
  "exif" | "icc" | "iptc" | "xmp" | "tifftagPhotoshop"
>;

export interface SerializedMetadata extends Omit<Metadata, BufferField> {
  exif: string | undefined;
  icc: string | undefined;
  iptc: string | undefined;
  xmp: string | undefined;
  tifftagPhotoshop: string | undefined;
}
