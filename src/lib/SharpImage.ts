"use client";

import sharp from "sharp";
import type { PixelCrop } from "react-image-crop";

interface ImageConstructor {
  dataUrl: string;
  el: HTMLImageElement;
  buffer?: Buffer<ArrayBuffer>;
}

class SharpImage {
  private dataUrl: string;
  private el: HTMLImageElement;
  private image: sharp.Sharp;
  private buffer: Buffer<ArrayBuffer>;
  private metadata: sharp.Metadata | null = null;

  constructor({ dataUrl, el, buffer }: ImageConstructor) {
    this.dataUrl = dataUrl;
    this.el = el;

    const buf =
      buffer || this.isFormattedDataUrl(dataUrl)
        ? Buffer.from(dataUrl.split(",")[1], "base64")
        : Buffer.from(dataUrl, "base64");

    this.buffer = buf;
    this.image = sharp(buf);

    this.setMetadata();
  }

  async setMetadata() {
    const md = await this.image.metadata();
    this.metadata = md;
  }

  dataUrlPrefix(type: string) {
    return `data:image/${type};base64,`;
  }

  isFormattedDataUrl(url?: string) {
    return (url || this.dataUrl).startsWith("data:");
  }

  async getDataUrl() {
    if (this.isFormattedDataUrl(this.dataUrl)) {
      return this.dataUrl;
    }

    const { format } = this.metadata || (await this.getMetadata());
    return this.dataUrlPrefix(format) + this.dataUrl;
  }

  async getMetadata() {
    if (this.metadata) {
      return this.metadata;
    }

    const md = await this.image.metadata();
    this.metadata = md;
    return md;
  }

  getCroppedImg(
    image: HTMLImageElement,
    crop: PixelCrop
    // ): { dataUrl: string; metadata: Metadata } {
  ) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    console.log("Scale:", { scaleX, scaleY });

    const w = crop.width * scaleX;
    const h = crop.height * scaleY;
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.imageSmoothingEnabled = false;

      ctx.drawImage(image, crop.x * scaleX, crop.y * scaleY, w, h, 0, 0, w, h);
    }

    //   return {
    //     //   dataUrl: canvas.toDataURL("image/png", 1.0),
    //     dataUrl: canvas.toDataURL(`image/${data.type}`, 1.0),
    //     metadata: { width: w, height: h, format: data.type! },
    //     //   metadata: null,
    //   };
  }
}

export default SharpImage;
