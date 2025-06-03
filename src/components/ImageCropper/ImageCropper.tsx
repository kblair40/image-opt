"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Crop as CropIcon } from "lucide-react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  //   convertToPixelCrop,
} from "react-image-crop";
import type { Crop, PixelCrop, PercentCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import type { EditData } from "@/components/ImageList/ImageList";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type {
  AllowedImageFormat,
  Dimensions,
  CroppedImage,
} from "@/lib/image-types";
// import { resizeImage } from "@/actions/resizeImage";
import { cropImage } from "@/actions/cropImage";
import { useDebounceFn } from "@/hooks/useDebounceFn";
import { getCroppedImg } from "@/lib/client-image-utils";

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
  const [pctCrop, setPctCrop] = useState<PercentCrop>();
  const [croppedImage, setCroppedImage] = React.useState<CroppedImage>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(
    data.width / data.height
  );
  const [width, setWidth] = useState(data.width);
  const [height, setHeight] = useState(data.height);
  const [resizing, setResizing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const { run: debounce } = useDebounceFn();

  const fmt = data.format as AllowedImageFormat;

  //   if (!data.format) {
  //     return (
  //       <div className="h-40 centered text-red-600">
  //         <p>Image type must be provided</p>
  //       </div>
  //     );
  //   }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  function handleResizeImage(dims: Dimensions) {
    console.group("RESIZING");
    setResizing(true);

    try {
      const { width, height } = dims;
      const croppedImage = getCroppedImg({
        image: imgRef.current!,
        crop: { x: 0, y: 0, width, height, unit: "px" },
        fmt,
      });

      setCroppedImage(croppedImage);
    } catch (e) {
      console.log("Failed to resize:", e);
    }

    setResizing(false);
    console.groupEnd();
  }

  function handleClickCrop() {
    console.log({ crop, completedCrop });
    if (!crop || !completedCrop) return;
    if (imgRef.current && crop.width && crop.height) {
      const croppedImage = getCroppedImg({
        image: imgRef.current!,
        crop: completedCrop,
        fmt,
      });
      setCroppedImage(croppedImage);
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

  function handleCropChange(pxCrop: PixelCrop, pctCrop: PercentCrop) {
    console.log("\nCROP CHANGE:", { pxCrop, pctCrop });

    setPctCrop(pctCrop);
    setCrop(pxCrop);

    debounce(() => {
      if (imgRef.current) {
        const croppedImage = getCroppedImg({
          image: imgRef.current!,
          crop: pxCrop,
          fmt,
        });
        setCroppedImage(croppedImage);
      }
    });
  }

  function handleCropComplete(pxCrop: PixelCrop) {
    console.log("\nCROP Complete:", { pxCrop });

    if (!pctCrop) return;
    const croppedImage = getCroppedImg({
      image: imgRef.current!,
      crop: pxCrop,
      fmt,
    });
    console.log("\nCropped Image:", croppedImage);

    setCompletedCrop(pxCrop);
    setCrop(pxCrop);

    if (croppedImage) {
      setCroppedImage(croppedImage);
    }
  }

  return (
    <div className="px-4 w-full h-dvh max-h-dvh flex flex-col">
      <section className="pt-3 pb-1 flex gap-x-4">
        <Button onClick={() => setShowPreview((cur) => !cur)}>
          Show {showPreview ? "Original" : "Preview"}
        </Button>
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

      {/* <section className="grow max-h-full overflow-y-auto centered z-50"> */}
      <section className="grow max-h-full overflow-auto centered z-50">
        {!showPreview ? (
          <ReactCrop
            crop={crop}
            onChange={handleCropChange}
            // onChange={(px, pct) => debounce(() => handleCropChange(px, pct))}
            // onChange={(_, percentCrop) => setCrop(percentCrop)}
            // onComplete={(c) => setCompletedCrop(c)}
            // onComplete={(c) => {
            //     console.log('Completed Crop:', c)
            //     setCompletedCrop(c)
            // }}
            onComplete={handleCropComplete}
            // className="w-full h-full relative"
            aspect={aspect}
            ruleOfThirds={true}
            className="w-full h-full"
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
        ) : // ) : croppedImageUrl && croppedImageMetadata ? (
        croppedImage ? (
          <Image
            alt="alt-placeholder"
            src={croppedImage.dataUrl}
            onLoad={onImageLoad}
            // style={{ maxHeight: "100%" }}
            style={{ maxWidth: "100%" }}
            width={croppedImage.metadata.width}
            height={croppedImage.metadata.height}
            //   className="object-cover"
            //   fill
            onError={(e) => {
              console.log("\nError loading image:", e);
            }}
          />
        ) : //   <Image
        //     alt="alt-placeholder"
        //     src={croppedImageUrl}
        //     onLoad={onImageLoad}
        //     // style={{ maxHeight: "100%" }}
        //     style={{ maxWidth: "100%" }}
        //     width={croppedImageMetadata.width}
        //     height={croppedImageMetadata.height}
        //     //   className="object-cover"
        //     //   fill
        //     onError={(e) => {
        //       console.log("\nError loading image:", e);
        //     }}
        //   />
        null}
      </section>

      <section>
        stuff footer
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
