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
// import "react-image-crop/dist/ReactCrop.css";
import "@/app/image-cropper.css";

import type { EditData } from "@/components/ImageList/ImageList";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type {
  AllowedImageFormat,
  Dimensions,
  CroppedImage,
  // SerializedMetadata,
  Metadata,
} from "@/lib/image-types";
import { resizeImage } from "@/actions/resizeImage";
import { cropImage } from "@/actions/cropImage";
import { useDebounceFn } from "@/hooks/useDebounceFn";
import { getCroppedImg, deserializeMetadata } from "@/lib/client-image-utils";
import { getImageMetadata } from "@/actions/getImageMetadata";
import { AspectRatio } from "../ui/aspect-ratio";

type Props = {
  data: EditData;
};

function getSizeString(bytes?: number) {
  if (!bytes) return "?kb";
  const kb = bytes / 1000;

  return kb >= 1000 ? (kb / 1000).toFixed(1) + "mb" : kb.toFixed(1) + " kb";
}

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
  const [croppedImage, setCroppedImage] = useState<CroppedImage>();
  const [croppedImageMetadata, setCroppedImageMetadata] = useState<Metadata>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(
    data.width / data.height
  );
  const [width, setWidth] = useState(data.width);
  const [height, setHeight] = useState(data.height);
  const [quality, setQuality] = useState(90);
  const [resizing, setResizing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const { run: debounce } = useDebounceFn();

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

  const fmt = data.format as AllowedImageFormat;

  // 1536 x 2048
  // How much should width be multiplied by to get height
  const hMult = data.height / data.width;
  // How much should height be multiplied by to get width
  const wMult = data.width / data.height;

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

  async function handleResizeImage(dims: Dimensions) {
    console.group("RESIZING:", dims);
    setResizing(true);

    try {
      const { width, height } = dims;
      const croppedImage = getCroppedImg({
        image: imgRef.current!,
        crop: { x: 0, y: 0, width, height, unit: "px" },
        fmt,
        useExact: true,
      });

      // TODO: GET METADATA FROM cropImage METHOD INSTEAD
      // const md = await getImageMetadata(croppedImage.dataUrl);
      // if (md) {
      //   setCroppedImageMetadata(deserializeMetadata(md));
      // }

      // const img = null;
      const img = await resizeImage(data.dataUrl, dims);
      console.log("Resized Image:", img);
      // const img = await cropImage(croppedImage.dataUrl, pctCrop, {
      //   output: { quality },
      //   resize:
      //     width !== data.width || height !== data.height
      //       ? { width, height }
      //       : undefined,
      // });
      // console.log("img.md:", img);
      if (img) {
        setCroppedImageMetadata(deserializeMetadata(img.metadata));
        setWidth(dims.width);
        setHeight(dims.height);
      }

      console.log({ croppedImage });

      setCroppedImage(croppedImage);
    } catch (e) {
      console.log("Failed to resize:", e);
    }

    setResizing(false);
    console.groupEnd();
  }

  const handleChangeDimensions = (dim: "height" | "width", value: string) => {
    const numericValue = Number.isNaN(value) ? null : parseFloat(value);
    if (!numericValue) return;
    const dims = { height, width };
    if (dim === "height") {
      const h = Math.min(data.height, numericValue);
      setHeight(h);
      dims.height = h;

      if (!!aspect) {
        const w = Math.floor(h * wMult);
        setWidth(w);
        dims.width = w;
      }
    } else {
      const w = Math.min(data.width, numericValue);
      setWidth(w);
      dims.width = w;

      if (!!aspect) {
        const h = Math.floor(w * hMult);
        dims.height = h;
        setHeight(h);
      }
    }

    debounce(() => handleResizeImage(dims));
  };

  function handleCropChange(pxCrop: PixelCrop, pctCrop: PercentCrop) {
    console.log("\nCROP CHANGE:", { pxCrop, pctCrop });

    setPctCrop(pctCrop);
    setCrop(pxCrop);

    // debounce(async () => {
    //   if (imgRef.current) {
    //     const croppedImage = getCroppedImg({
    //       image: imgRef.current!,
    //       crop: pxCrop,
    //       fmt,
    //     });

    //     // TODO: GET METADATA FROM cropImage METHOD INSTEAD
    //     // const md = await getImageMetadata(croppedImage.dataUrl);
    //     // if (md) {
    //     //   setCroppedImageMetadata(deserializeMetadata(md));
    //     // }

    //     const img = await cropImage(croppedImage.dataUrl, pctCrop, {
    //       output: { quality },
    //     });
    //     console.log("img.md:", img);
    //     if (img) {
    //       setCroppedImageMetadata(deserializeMetadata(img.metadata));
    //       setWidth(img.metadata.width);
    //       setHeight(img.metadata.height);
    //     }

    //     setCroppedImage(croppedImage);
    //   }
    // });
  }

  async function handleCropComplete(pxCrop: PixelCrop, pctCrop: PercentCrop) {
    console.log("\nCROP Complete:", { pxCrop, pctCrop });

    setCompletedCrop(pxCrop);

    // if (!pctCrop) return;

    // const croppedImage = getCroppedImg({
    //   image: imgRef.current!,
    //   crop: pxCrop,
    //   fmt,
    // });
    // console.log("\nCropped Image:", croppedImage);

    // // TODO: GET METADATA FROM cropImage METHOD INSTEAD
    // // const img = await cropImage(croppedImage.dataUrl, pctCrop, {
    // // const img = await cropImage(croppedImage.dataUrl, pxCrop, {
    // const img = await cropImage(data.dataUrl, pctCrop, {
    //   output: { quality },
    // });
    // console.log("img.md:", img);
    // if (img) {
    //   setCroppedImageMetadata(deserializeMetadata(img.metadata));
    //   setWidth(img.metadata.width);
    //   setHeight(img.metadata.height);

    //   setCroppedImage({
    //     dataUrl: img.dataUrl,

    //     metadata: {
    //       width: img.metadata.width,
    //       height: img.metadata.height,
    //       // @ts-ignore
    //       format: img.metadata.format,
    //     },
    //   });
    // }

    // setCompletedCrop(pxCrop);
    // setCrop(pctCrop);
    // // setCrop(pxCrop);

    // // if (croppedImage) {
    // //   setCroppedImage(croppedImage);
    // // }
  }

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
      <section className="grow centered z-50">
        {/* <div className="min-h-fit h-full"> */}
        {!showPreview ? (
          // <div className="relative w-full h-full border-2 border-red-400">
          <ReactCrop
            crop={crop}
            // onChange={handleCropChange}
            // onChange={handleCropChange}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={handleCropComplete}
            // className="w-full h-full relative"
            aspect={aspect}
            // ruleOfThirds={true}
            // className="h-full"
            // className="h-full w-full border border-blue-600 **:h-full"
            // className="h-full w-full border border-blue-600"
            // style={{ maxWidth: "90dvw" }}
            // style={{ display: "flex", flexDirection: "column", height: "100%" }}
            //
            // style={{ height: `${data.height}px`, width: `${data.width}px` }}
          >
            <img
              alt="alt-placholder"
              src={data.dataUrl}
              onLoad={onImageLoad}
              // style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
            />
            {/* <Image
                ref={imgRef}
                alt="alt-placeholder"
                src={data.dataUrl}
                onLoad={onImageLoad}
                width={data.width}
                height={data.height}
                className="object-contain"
              /> */}
          </ReactCrop>
        ) : // </div>
        // ) : croppedImageUrl && croppedImageMetadata ? (
        croppedImage && completedCrop ? (
          <div>
            <canvas
              ref={previewCanvasRef}
              style={{
                border: "1px solid black",
                objectFit: "contain",
                width: completedCrop.width,
                height: completedCrop.height,
              }}
            />
          </div>
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
        {/* </div> */}
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
