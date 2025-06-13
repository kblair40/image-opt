"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import ReactCrop from "react-image-crop";
import type { Crop, PercentCrop, PixelCrop } from "react-image-crop";

import "react-image-crop/dist/ReactCrop.css";

import { useDebounceEffect } from "@/hooks/useDebounceEffect";
import { EditData } from "@/store/ImagesContext";
import { centerAspectCrop, canvasPreview } from "@/lib/client-image-utils";

type Props = {
  data: EditData;
  showPreview: boolean;
  completedCrop?: PixelCrop;
  completedPctCrop?: PercentCrop;
  onCropChange: (
    pxCrop: PixelCrop,
    pctCrop: PercentCrop,
    canvas: HTMLCanvasElement
  ) => void;
  aspect?: number;
};

const ImageCropper = ({
  data,
  showPreview,
  completedCrop,
  completedPctCrop,
  onCropChange,
  aspect,
}: Props) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const [crop, setCrop] = useState<Crop | undefined>(completedPctCrop);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (crop) return;
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect, 100));
    }
  }

  // useDebounceEffect(
  //   async () => {
  //     if (
  //       completedCrop?.width &&
  //       completedCrop?.height &&
  //       imgRef.current &&
  //       previewCanvasRef.current
  //     ) {
  //       // We use canvasPreview as it's much faster than imgPreview.
  //       canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
  //     }
  //   },
  //   100,
  //   [completedCrop]
  // );

  function handleCropChange(px: PixelCrop, pct: PercentCrop) {
    if (
      // completedCrop?.width &&
      // completedCrop?.height &&
      imgRef.current &&
      previewCanvasRef.current
    ) {
      canvasPreview(imgRef.current, previewCanvasRef.current, px);

      console.log("Canvas:", previewCanvasRef.current);
      onCropChange(px, pct, previewCanvasRef.current);
    } else {
      console.log("SOMETHING MISSING:", {
        completedCrop,
        imgRef: imgRef.current,
        previewCanvasRef: previewCanvasRef.current,
      });
    }
  }

  return (
    <div className="h-full">
      {!showPreview && (
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={handleCropChange}
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

      {/* {completedCrop && ( */}
      <canvas
        ref={previewCanvasRef}
        style={{
          objectFit: "contain",
          width: showPreview && completedCrop ? completedCrop.width : 0,
          height: showPreview && completedCrop ? completedCrop.height : 0,
          opacity: showPreview ? 1 : 0,
        }}
      />
      {/* )} */}
    </div>
  );
};

export default ImageCropper;
