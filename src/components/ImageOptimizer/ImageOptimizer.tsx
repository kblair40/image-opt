"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { unstable_ViewTransition as ViewTransition } from "react";
import { Crop as CropIcon, Save, ChevronRight, ArrowRight } from "lucide-react";
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

const ImageOptimizer = ({ data }: Props) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(
    data.width / data.height
  );
  const [showPreview, setShowPreview] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const initialData = {
    size: getSizeString(data.size),
    width: data.width,
    height: data.height,
  };

  function handleToggleAspectRatio(checked: boolean) {
    if (checked) setAspect(data.width / data.height);
    else setAspect(undefined);
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (crop) return;
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  function handleClickSave() {
    //
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
    <div className="px-4 w-full h-dvh max-h-dvh flex flex-col">
      <section className="pt-3 pb-2 pr-20 flex justify-between">
        <div className="text-sm flex items-center flex-row gap-x-2">
          <p>
            {initialData.width} x {initialData.height}
          </p>
          {completedCrop && <ArrowRight size={20} className="" />}
          <p>
            {completedCrop
              ? `${Math.round(completedCrop.width)} x ${Math.round(
                  completedCrop.height
                )}`
              : ""}
          </p>
        </div>

        <div className="flex gap-x-4">
          <div className="flex items-center gap-x-2 mr-8">
            <Label>Force Aspect?</Label>
            <Checkbox
              checked={!!aspect}
              onCheckedChange={(v) => handleToggleAspectRatio(!!v)}
            />
          </div>

          <div className="flex items-center gap-x-4">
            {showPreview ? (
              <Button onClick={() => setShowPreview(false)}>
                Show Original
              </Button>
            ) : (
              <Button onClick={() => setShowPreview(true)}>
                Crop <CropIcon />
              </Button>
            )}

            {showPreview && (
              <Button onClick={handleClickSave}>
                Save <Save />
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="grow overflow-auto centered z-50">
        {!showPreview && (
          <div className="h-full">
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
          <div className={showPreview ? "h-full" : ""}>
            <canvas
              ref={previewCanvasRef}
              style={{
                objectFit: "contain",
                width: showPreview ? completedCrop.width : 0,
                height: showPreview ? completedCrop.height : 0,
                opacity: showPreview ? 1 : 0,
              }}
            />
          </div>
        )}
      </section>

      <section className="min-h-16 flex items-center">footer</section>
    </div>
  );
};

export default ImageOptimizer;
