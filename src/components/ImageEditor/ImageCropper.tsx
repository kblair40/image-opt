"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import ReactCrop from "react-image-crop";
import type { Crop, PixelCrop } from "react-image-crop";

import "react-image-crop/dist/ReactCrop.css";

import { useDebounceEffect } from "@/hooks/useDebounceEffect";
import { EditData } from "@/store/ImagesContext";
import {
  centerAspectCrop,
  canvasPreview,
} from "@/lib/client-image-utils";

type Props = {
  data: EditData;
  showPreview: boolean;
  completedCrop?: PixelCrop;
  onCropChange: (pixelCrop: PixelCrop) => void;
  aspect?: number;
};

const ImageCropper = ({
  data,
  showPreview,
  completedCrop,
  onCropChange,
  aspect,
}: Props) => {
  const [crop, setCrop] = useState<Crop>();

  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (crop) return;
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect, 100));
    }
  }

  useDebounceEffect(
    async () => {
      // console.log("DEBOUNCE EFFECT", {
      //   completedCrop,
      //   img: imgRef.current,
      //   canvas: previewCanvasRef.current,
      // });
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
      }
    },
    100,
    [completedCrop]
  );

  return (
    <div className="">
      {!showPreview && (
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => onCropChange(c)}
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
      )}

      {completedCrop && (
        <canvas
          ref={previewCanvasRef}
          style={{
            objectFit: "contain",
            width: showPreview ? completedCrop.width : 0,
            height: showPreview ? completedCrop.height : 0,
            opacity: showPreview ? 1 : 0,
          }}
        />
      )}
    </div>
  );
};

export default ImageCropper;
