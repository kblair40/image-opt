import type { JpegOptions, PngOptions, WebpOptions, AvifOptions } from "sharp";

export type AllowedImageType = "jpeg" | "png" | "webp" | "avif";

export type AnyOutputOptions = JpegOptions | PngOptions | WebpOptions | AvifOptions
export interface OutputOptions {
  jpeg: JpegOptions;
  png: PngOptions;
  webp: WebpOptions;
  avif: AvifOptions;
}
