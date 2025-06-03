"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Crop as CropIcon } from "lucide-react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  convertToPixelCrop,
} from "react-image-crop";
import type { Crop, PixelCrop, PercentCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import type { EditData } from "@/components/ImageList/ImageList";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { AllowedImageType, Dimensions } from "@/lib/image-types";
import { resizeImage } from "@/actions/resizeImage";
import { cropImage } from "@/actions/cropImage";
import { useDebounceFn } from "@/hooks/useDebounceFn";
// import type { Metadata } from "../ImageList/ImageListImage";
import type { OptimizedMetadata } from "@/actions/resizeImage";
// import Image from "../Image/Image";
// import { AspectRatio } from "@/components/ui/aspect-ratio";
// import SharpImage from "@/lib/SharpImage";

type Metadata = OptimizedMetadata["metadata"];

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

function dataUrlPrefix(type: string) {
  return `data:image/${type};base64,`;
}

const ImageCropper = ({ data }: Props) => {
  const [crop, setCrop] = useState<Crop>();
  const [pctCrop, setPctCrop] = useState<PercentCrop>();
  //   const [aspect, setAspect] = useState<number | undefined>(16 / 9);
  const [croppedImageUrl, setCroppedImageUrl] = React.useState<string>("");
  const [croppedImageMetadata, setCroppedImageMetadata] =
    React.useState<Metadata>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(
    data.width / data.height
  );
  const [width, setWidth] = useState(data.width);
  const [height, setHeight] = useState(data.height);
  const [resizing, setResizing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  //   const sharpImage = useRef(
  //     new SharpImage({
  //       dataUrl: data.dataUrl,
  //       el: "" as unknown as HTMLImageElement,
  //       //   el: imgRef.current,
  //     })
  //   );
//   const sharpImage = useRef<SharpImage | null>(null);

  const { run: debounce } = useDebounceFn();

//   useEffect(() => {
//     sharpImage.current = new SharpImage({
//       dataUrl: data.dataUrl,
//       el: imgRef.current!,
//     });
//   }, [data.dataUrl]);

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

      if (resizedImage) {
        setCroppedImageUrl(
          dataUrlPrefix(resizedImage.metadata.type || "") + resizedImage.dataUrl
        );
        setCroppedImageMetadata(resizedImage.metadata);
      }
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
      const { dataUrl } = getCroppedImg(imgRef.current, completedCrop);
      setCroppedImageUrl(dataUrl);
    }
  }

  function getCroppedImg(
    image: HTMLImageElement,
    crop: PixelCrop
  ): { dataUrl: string; metadata: Metadata } {
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

    return {
      //   dataUrl: canvas.toDataURL("image/png", 1.0),
      dataUrl: canvas.toDataURL(`image/${data.type}`, 1.0),
      metadata: { width: w, height: h, format: data.type! },
      //   metadata: null,
    };
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

  function handleCropChange(pxCrop: PixelCrop, pctCrop: PercentCrop) {
    console.log("\nCROP CHANGE:", { pxCrop, pctCrop });

    // debounce(() => setCrop(pctCrop));
    // setCrop(pctCrop);
    setPctCrop(pctCrop);
    setCrop(pxCrop);

    debounce(() => {
      if (imgRef.current) {
        const { dataUrl, metadata } = getCroppedImg(imgRef.current, pxCrop);
        setCroppedImageUrl(dataUrl);
        setCroppedImageMetadata(metadata);
      }
    });
  }

  async function handleCropComplete(pxCrop: PixelCrop) {
    console.log("\nCROP Complete:", { pxCrop });

    if (!pctCrop) return;
    const croppedImage = await cropImage(data.dataUrl, pctCrop);
    console.log("\nCropped Image:", croppedImage);

    setCrop(pxCrop);

    if (croppedImage) {
      setCroppedImageUrl(
        dataUrlPrefix(croppedImage.metadata.type || "") + croppedImage.dataUrl
      );
      setCroppedImageMetadata(croppedImage.metadata);
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
        ) : croppedImageUrl && croppedImageMetadata ? (
          <Image
            alt="alt-placeholder"
            src={croppedImageUrl}
            onLoad={onImageLoad}
            // style={{ maxHeight: "100%" }}
            style={{ maxWidth: "100%" }}
            width={croppedImageMetadata.width}
            height={croppedImageMetadata.height}
            //   className="object-cover"
            //   fill
            onError={(e) => {
              console.log("\nError loading image:", e);
            }}
          />
        ) : null}
      </section>

      <section>
        stuff footer
        {/*  */}
      </section>
    </div>
  );
};

export default ImageCropper;
