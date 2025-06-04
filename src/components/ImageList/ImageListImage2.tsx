"use client";

import React, { useState, useEffect, useCallback } from "react";
import clsx from "clsx";
import Image from "next/image";
import { Settings } from "lucide-react";

import { getImageMetadata } from "@/actions/getImageMetadata";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import ImageListImageActions from "./ImageListImageActions";
import type {
  AllowedImageFormat,
  OptimizedMetadata,
  Metadata,
} from "@/lib/image-types";
import { compressImage } from "@/actions/compressImage";
import { deserializeMetadata } from "@/lib/client-image-utils";

type Props = {
  image: File;
  onClickEditImage: (image: File, md: Metadata, dataUrl: string) => void;
};

function getSizeString(bytes?: number) {
  if (!bytes) return "?kb";
  const kb = bytes / 1000;

  return kb >= 1000 ? (kb / 1000).toFixed(1) + "mb" : kb.toFixed(1) + " kb";
}

const ImageListImage2 = ({ image, onClickEditImage }: Props) => {
  const [imgUrl, setImgUrl] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [readErr, setReadErr] = useState<ProgressEvent<FileReader> | null>(
    null
  );
  const [metadata, setMetadata] = useState<Metadata>();
  const [optimizedImage, setOptimizedImage] = useState<OptimizedMetadata>();

  const getMetadata = useCallback(async () => {
    const reader = new FileReader();

    reader.onerror = (e) => {
      setLoading(false);
      console.log("file reading has failed");
      setReadErr(e);
    };

    reader.onload = async () => {
      console.log("Data URL:", reader.result);
      if (typeof reader.result === "string") {
        setImgUrl(reader.result);
        const md = await getImageMetadata(reader.result);
        console.log("\nMETADATA:", md, "\n");

        if (md) {
          setMetadata({ ...deserializeMetadata(md) } as Metadata);
        }
        setLoading(false);
      }
    };

    reader.readAsDataURL(image);
  }, [image]);

  useEffect(() => {
    getMetadata();
  }, [getMetadata]);

  async function handleClickConvert(type: AllowedImageFormat) {
    console.log("Convert to:", type);
    if (imgUrl) {
      const res = await compressImage(imgUrl, type);

      if (res) {
        const dataUrl =
          `data:image/${res.metadata.format};base64,` + res.dataUrl;
        console.log("Result:", { ...res, dataUrl });
        setOptimizedImage({ ...res, dataUrl });
      } else {
        console.warn("\nConversion/compression failed\n");
      }
    }
  }

  return (
    <div className="text-sm overflow-hidden rounded-sm border border-neutral-300 relative h-40 centered-col">
      {loading || !imgUrl || !metadata ? (
        <div className="centered">
          <div className="h-8 w-8 border border-neutral-600 rounded-md animate-spin" />
        </div>
      ) : (
        <>
          <Image
            alt={image.name}
            src={imgUrl}
            style={{ objectFit: "cover" }}
            fill
          />

          <Controls
            metadata={metadata}
            image={image}
            onClickEditImage={onClickEditImage}
            dataUrl={imgUrl}
          />
        </>
      )}
    </div>
  );
};

export default ImageListImage2;

function Controls({
  image,
  onClickEditImage,
  metadata,
  dataUrl,
}: Props & { metadata: Metadata; dataUrl: string }) {
  const size = getSizeString(metadata.size);
  const dims = metadata.width + " x " + metadata.height;
  return (
    <div
      className={clsx(
        "absolute top-0 left-0 right-0 bottom-0 w-full h-full",
        // "z-50",
        // "bg-linear-to-t from-neutral-950/90 from-0% to-neutral-950/60 to-40%",
        "bg-linear-to-t from-neutral-900/90 from-10% via-neutral-800/80 via-30% to-neutral-800/30 to-70%",
        // "border-2 border-neutral-800"
        "flex items-end"
      )}
    >
      <div className="w-full flex flex-col justify-end px-1.5 pb-1 text-white text-xs">
        {/* <div> */}
        <p>{image.name}</p>
        {/* </div> */}

        <div className="w-full flex items-end justify-between">
          <div className="flex gap-x-4">
            <p>{size}</p>
            <p>{dims}</p>
          </div>

          <div className="absolute bottom-1 right-1 cursor-pointer">
            <Button
              onClick={() => onClickEditImage(image, metadata, dataUrl)}
              size="icon"
              className="cursor-pointer hover:bg-neutral-800"
            >
              <Settings />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
