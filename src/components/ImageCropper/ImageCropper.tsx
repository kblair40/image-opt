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

import type { EditData } from "../ImageList/ImageList";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
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

  const imgRef = useRef<HTMLImageElement>(null);

  //   const { width, height, type } = data;
  //   const dataUrl = `data:image/${type};base64,` + data.dataUrl;

  console.log("DATA URL:", data.dataUrl);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
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

  return (
    <div className="px-4 w-full h-dvh max-h-dvh flex flex-col">
      <section className="pt-3 pb-1">
        <Button onClick={handleClickCrop} variant="outline" className={cn("p-1")}>
          <CropIcon className="size-5" />
        </Button>
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
