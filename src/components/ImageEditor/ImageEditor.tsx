"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { PixelCrop } from "react-image-crop";

import type { EditData } from "@/components/ImageList/ImageList";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { getSizeString, toBlob } from "@/lib/client-image-utils";
import ImageOptimizer from "./ImageOptimizer";
import clsx from "clsx";
import { useImagesContext } from "@/hooks/useImagesContext";
import ImageCropper from "./ImageCropper";

type Props = {
  data: EditData;
};

type Mode = "crop" | "optimize";

const ImageEditor = ({ data }: Props) => {
  const {} = useImagesContext();

  const [mode, setMode] = useState<Mode>("crop");
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(
    data.width / data.height
  );
  const [showPreview, setShowPreview] = useState(false);
  const [dataUrl, setDataUrl] = useState(data.dataUrl);

  const initialData = {
    size: getSizeString(data.size),
    width: data.width,
    height: data.height,
  };

  function handleToggleAspectRatio(checked: boolean) {
    if (checked) setAspect(data.width / data.height);
    else setAspect(undefined);
  }

  async function handleChangeMode(_mode: Mode) {
    if (_mode !== mode) {
      if (_mode === "optimize") {
        if (typeof window === "undefined") {
          return;
        }

        const canvas = document.querySelector<HTMLCanvasElement>("canvas");

        if (!canvas) {
          console.error("Canvas element not found");
          return;
        }

        console.log("CANVAS:", canvas);

        const dataUrl = canvas.toDataURL(`image/${data.format}`, 1.0);
        const { height, width } = canvas;
        console.log("\nData URL:", dataUrl, { width, height });
        setDataUrl(dataUrl);
      }
      setMode(_mode);
    }
  }

  function handleCropChange(crop: PixelCrop) {
    setCompletedCrop(crop);
  }

  return (
    <div className="px-4 w-full h-dvh max-h-dvh flex flex-col">
      <section className="pt-3 pb-2 pr-20 flex justify-between">
        <section className="flex gap-x-8">
          <div className="text-sm flex items-center flex-row gap-x-2">
            {mode === "crop" && (
              <>
                <p>
                  {initialData.width} x {initialData.height}
                </p>
                {completedCrop && <ArrowRight size={20} className="" />}
              </>
            )}

            <p>
              {completedCrop
                ? `${Math.round(completedCrop.width)} x ${Math.round(
                    completedCrop.height
                  )}`
                : ""}
            </p>
          </div>

          <div className="flex gap-x-4">
            {mode === "crop" && (
              <div className="flex items-center gap-x-2 mr-8">
                <Label>Force Aspect?</Label>
                <Checkbox
                  checked={!!aspect}
                  onCheckedChange={(v) => handleToggleAspectRatio(!!v)}
                />
              </div>
            )}
          </div>
        </section>

        <section className="flex gap-x-3">
          <Button
            size="sm"
            onClick={() => handleChangeMode("crop")}
            variant={mode === "crop" ? "default" : "secondary"}
          >
            Crop
          </Button>

          <Button
            size="sm"
            onClick={() => handleChangeMode("optimize")}
            variant={mode === "optimize" ? "default" : "secondary"}
          >
            Optimize
          </Button>
        </section>
      </section>

      <section className={clsx("grow overflow-auto centered z-50 py-4")}>
        {mode === "crop" ? (
          <ImageCropper
            data={data}
            showPreview={showPreview}
            onCropChange={handleCropChange}
            completedCrop={completedCrop}
            aspect={aspect}
          />
        ) : (
          <ImageOptimizer
            crop={completedCrop}
            dataUrl={dataUrl}
            // dims={{
            //   width: completedCrop?.width || 0,
            //   height: completedCrop?.height || 0,
            // }}
          />
        )}
      </section>

      <section className="min-h-16 centered">
        <Button size="sm" onClick={() => setShowPreview((cur) => !cur)}>
          {showPreview ? "Show Original Image" : "Preview Cropped Image"}
        </Button>
      </section>
    </div>
  );
};

export default ImageEditor;
