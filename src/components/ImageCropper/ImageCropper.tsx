"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Crop as CropIcon } from "lucide-react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  convertToPixelCrop,
} from "react-image-crop";
import type { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import type { EditData } from "@/components/ImageList/ImageList";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { Dimensions } from "@/lib/image-types";
import { resizeImage } from "@/actions/resizeImage";
import { useDebounceFn } from "@/hooks/useDebounceFn";
// import Image from "../Image/Image";
// import { AspectRatio } from "@/components/ui/aspect-ratio";

type Props = {
  data: EditData;
};

function centerAspectCrop(
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

const ImageCropper = ({ data }: Props) => {
  const [crop, setCrop] = useState<Crop>();
  const [aspect, setAspect] = useState<number | undefined>(
    data.width / data.height
  );
  //   const [aspect, setAspect] = useState<number | undefined>(16 / 9);
  const [croppedImageUrl, setCroppedImageUrl] = React.useState<string>("");
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [width, setWidth] = useState(data.width);
  const [height, setHeight] = useState(data.height);
  const [resizing, setResizing] = useState(false);

  const originalDims = { width: data.width, height: data.height };

  const imgRef = useRef<HTMLImageElement>(null);

  const { run: debounce } = useDebounceFn();

  //   const { width, height, type } = data;
  //   const dataUrl = `data:image/${type};base64,` + data.dataUrl;

//   console.log("DATA URL:", data.dataUrl);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  async function handleResizeImage(dims: Dimensions) {
    console.group("RESIZING");
    setResizing(true);

    try {
      const resizedImage = await resizeImage(data.dataUrl, dims);
      console.log("\nResized Image:", resizedImage);
    } catch (e) {
      console.log("Failed to resize:", e);
    }

    setResizing(false);
    console.groupEnd();
  }

  function handleClickCrop() {
    if (!crop || !completedCrop) return;
    if (imgRef.current && crop.width && crop.height) {
      const croppedImageUrl = getCroppedImg(imgRef.current, completedCrop);
      setCroppedImageUrl(croppedImageUrl);
    }
  }

  function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): string {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.imageSmoothingEnabled = false;

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      );
    }

    return canvas.toDataURL("image/png", 1.0);
  }

  function handleToggleAspectClick() {
    if (aspect) {
      setAspect(undefined);
    } else {
      setAspect(16 / 9);

      if (imgRef.current) {
        const { width, height } = imgRef.current;
        const newCrop = centerAspectCrop(width, height, 16 / 9);
        setCrop(newCrop);
        // Updates the preview
        setCompletedCrop(convertToPixelCrop(newCrop, width, height));
      }
    }
  }

  const handleChangeDimensions = (dim: "height" | "width", value: string) => {
    const numericValue = Number.isNaN(value) ? null : parseFloat(value);
    if (!numericValue) return;
    const dims = { height, width };
    if (dim === "height") {
      const h = Math.min(data.height, numericValue);
      setHeight(h);
      dims.height = h;
    } else {
      const w = Math.min(data.width, numericValue);
      setWidth(w);
      dims.width = w;
    }

    debounce(() => handleResizeImage(dims));
  };

  return (
    <div className="px-4 w-full h-dvh max-h-dvh flex flex-col">
      <section className="pt-3 pb-1 flex gap-x-4">
        <Button
          onClick={handleClickCrop}
          variant="outline"
          className={cn("p-1")}
        >
          <CropIcon className="size-5" />
        </Button>

        <div className="flex gap-x-2">
          <Label>Width</Label>
          <Input
            type="number"
            value={width}
            onChange={(e) => {
              handleChangeDimensions("width", e.target.value);
            }}
            min={0}
            max={data.width}
          />
        </div>

        <div className="flex gap-x-2">
          <Label>Height</Label>
          <Input
            type="number"
            value={height}
            onChange={(e) => {
              handleChangeDimensions("height", e.target.value);
            }}
            min={0}
            max={data.height}
          />
        </div>
      </section>

      <section className="grow max-h-full overflow-y-auto">
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          // className="w-full h-full relative"
          aspect={aspect}
        >
          <Image
            ref={imgRef}
            alt="alt-placeholder"
            src={data.dataUrl}
            onLoad={onImageLoad}
            // style={{ maxHeight: "100%" }}
            style={{ maxWidth: "100%" }}
            width={data.width}
            height={data.height}
            //   className="object-cover"
            //   fill
          />
        </ReactCrop>
      </section>

      <section>
        stuff footer
        {/*  */}
      </section>
    </div>
  );
};

export default ImageCropper;
