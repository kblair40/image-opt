"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
// import { Crop as CropIcon } from "lucide-react";
import ReactCrop from "react-image-crop";
import type { Crop, PixelCrop, PercentCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
// import "@/app/image-cropper.css";

import type { EditData } from "@/components/ImageList/ImageList";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { CroppedImage, Metadata } from "@/lib/image-types";
// import { resizeImage } from "@/actions/resizeImage";
// import { cropImage } from "@/actions/cropImage";
// import { useDebounceFn } from "@/hooks/useDebounceFn";
import {
  getSizeString,
  centerAspectCrop,
  canvasPreview,
} from "@/lib/client-image-utils";
import { useDebounceEffect } from "@/hooks/useDebounceEffect";

type Props = {
  data: EditData;
};

const ImageCropper = ({ data }: Props) => {
  // const [width, setWidth] = useState(data.width);
  // const [height, setHeight] = useState(data.height);
  const [crop, setCrop] = useState<Crop>();
  const [croppedImage, setCroppedImage] = useState<CroppedImage>();
  const [croppedImageMetadata, setCroppedImageMetadata] = useState<Metadata>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(
    data.width / data.height
  );
  const [quality, setQuality] = useState(90);
  const [showPreview, setShowPreview] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const initialData = {
    size: getSizeString(data.size),
    width: data.width,
    height: data.height,
  };
  const croppedData = !croppedImageMetadata
    ? null
    : {
        size: croppedImageMetadata.size,
        width: croppedImageMetadata.width,
        height: croppedImageMetadata.height,
      };

  function handleToggleAspectRatio(checked: boolean) {
    if (checked) setAspect(data.width / data.height);
    else setAspect(undefined);
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  useDebounceEffect(
    async () => {
      console.log("DEBOUNCE EFFECT", {
        completedCrop,
        img: imgRef.current,
        canvas: previewCanvasRef.current,
      });
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        console.warn("CANVAS PREVIEW");
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
      }
    },
    100,
    [completedCrop]
  );

  return (
    <div className="px-4 w-full h-dvh max-h-dvh flex flex-col">
      <section className="pt-3 pb-2 pr-10 flex justify-between">
        <div className="flex gap-x-4">
          {/* <Button
          onClick={handleClickCrop}
          variant="outline"
          className={cn("p-1")}
        >
          <CropIcon className="size-5" />
        </Button> */}

          <div className="flex gap-x-2">
            <Label>Quality</Label>
            <Input
              type="number"
              value={quality}
              onChange={(e) => {
                setQuality(parseFloat(e.target.value));
              }}
              min={1}
              max={100}
            />
          </div>

          {/* <div className="flex gap-x-2">
            <Label>Width</Label>
            <Input type="number" value={width} min={0} max={data.width} />
          </div>
          <div className="flex gap-x-2">
            <Label>Height</Label>
            <Input type="number" value={height} min={0} max={data.height} />
          </div> */}

          <div className="flex items-center gap-x-2">
            <Label>Force Aspect?</Label>
            <Checkbox
              checked={!!aspect}
              onCheckedChange={(v) => handleToggleAspectRatio(!!v)}
            />
          </div>

          <Button
            className="ml-4"
            onClick={() => setShowPreview((cur) => !cur)}
          >
            Show {showPreview ? "Original" : "Preview"}
          </Button>
        </div>

        <div>
          <section className="text-sm flex flex-col md:flex-row md:gap-x-3">
            <p>
              {initialData.width} x {initialData.height}
            </p>
            <p>{initialData.size}</p>
          </section>

          <section className="text-sm flex flex-col md:flex-row md:gap-x-3">
            {croppedData && (
              <>
                <p>
                  {croppedData.width} x {croppedData.height}
                </p>
                <p>{getSizeString(croppedData.size)}</p>
              </>
            )}
          </section>
        </div>
      </section>

      {/* <section className="grow max-h-full overflow-y-auto centered z-50"> */}
      {/* <section className="grow max-h-full overflow-auto centered z-50"> */}
      <section className="grow overflow-auto centered z-50">
        {/* <div className="min-h-fit h-full"> */}
        {!showPreview && (
          <div className="w-full h-full">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              ruleOfThirds={true}
            >
              <Image
                ref={imgRef}
                alt="alt-placeholder"
                src={data.dataUrl}
                onLoad={onImageLoad}
                width={data.width}
                height={data.height}
                className="object-contain"
              />
            </ReactCrop>
          </div>
        )}

        {!!completedCrop && (
          <canvas
            ref={previewCanvasRef}
            style={{
              border: "1px solid black",
              objectFit: "contain",
              width: showPreview ? completedCrop.width : 0,
              height: showPreview ? completedCrop.height : 0,
              opacity: showPreview ? 1 : 0,
            }}
          />
        )}
      </section>

      <section className="min-h-16 flex items-center">
        footer
        {/*  */}
      </section>
    </div>
  );
};

export default ImageCropper;

// function handleToggleAspectClick() {
//     if (aspect) {
//       setAspect(undefined);
//     } else {
//       setAspect(16 / 9);

//       if (imgRef.current) {
//         const { width, height } = imgRef.current;
//         const newCrop = centerAspectCrop(width, height, 16 / 9);
//         setCrop(newCrop);
//         // Updates the preview
//         setCompletedCrop(convertToPixelCrop(newCrop, width, height));
//       }
//     }
//   }
