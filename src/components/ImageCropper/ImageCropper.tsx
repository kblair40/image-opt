"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  convertToPixelCrop,
} from "react-image-crop";
import type { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import type { EditData } from "../ImageList/ImageList";
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
  const [aspect, setAspect] = useState<number | undefined>(16 / 9);
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
    <div className="w-full h-full">
      {/* <AspectRatio ratio={16 / 9} className="w-full h-full relative"> */}
      {/* <div className="w-full h-full relative"> */}
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          className="w-full h-full relative"
          aspect={16 / 9}
        >
          <Image
            ref={imgRef}
            alt="alt-placeholder"
            src={data.dataUrl}
            className="object-cover"
            onLoad={onImageLoad}
            fill
          />
        </ReactCrop>
      {/* </div> */}
      {/* </AspectRatio> */}
    </div>
  );
};

export default ImageCropper;
