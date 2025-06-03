import type {
  JpegOptions,
  PngOptions,
  WebpOptions,
  AvifOptions,
  ResizeOptions,
  FormatEnum,
  OutputInfo
} from "sharp";
import type { ISizeCalculationResult } from "image-size/types/interface";

import { getCroppedImg } from "./client-image-utils";

export type CroppedImage = ReturnType<typeof getCroppedImg>;

type OptionalMetadata = Omit<
  OutputInfo,
  "channels" | "premultiplied" | "size"
> &
  Partial<Pick<OutputInfo, "channels" | "premultiplied" | "size">>;

export type OptimizedMetadata = {
  metadata: ISizeCalculationResult & OptionalMetadata;
  dataUrl: string;
};

export type AllowedImageFormat = keyof Pick<
  FormatEnum,
  "jpeg" | "jpg" | "png" | "avif" | "webp"
>;

export type AllowedImageType = "jpeg" | "png" | "webp" | "avif";

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
