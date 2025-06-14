"use client";

import React, { useState, useEffect, useCallback } from "react";

import type { AllowedImageFormat, Metadata } from "@/lib/image-types";
import {
  deserializeMetadata,
  toBlob,
  getSizeString,
} from "@/lib/client-image-utils";
import { changeFormat } from "@/actions/changeFormat";
import { getImageMetadata } from "@/actions/getImageMetadata";
import { getImageSize, getImageEtag } from "next/dist/server/image-optimizer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  croppedImage: string;
  originalImage: string;
};

type Data = {
  diff: number;
  diffPct: string;
  diffStr: string;
  size: { before: number; after: number };
  format: { before: string; after: string };
  croppedUrl: string;
  originalUrl: string;
};

const ImageOptimizerControls = ({
  croppedImage: _croppedImage,
  originalImage,
}: Props) => {
  const [data, setData] = useState<Data | null>(null);
  const [croppedImage, setCroppedImage] = useState<string>(_croppedImage);

  const [loading, setLoading] = useState(false);
  const [changingType, setChangingType] = useState(false);

  const updateCroppedImageData = useCallback(
    async (croppedImage: string) => {
      if (!data) return;

      const croppedMd = await getImageMetadata(croppedImage);
      if (!croppedMd) {
        console.log("\nError getting cropped image metadata");
        return;
      }

      const {
        size: { before: os },
        format: { before: of },
      } = data;

      const cs = croppedMd.size;

      if (!cs || !os) {
        console.log("Failed getting original and/or cropped image sizes:", {
          cs,
          os,
        });
        return;
      }

      //   setData((prev) => {
      //     if (!prev) return null;
      //     const newData = {
      //       ...prev,
      //       diff: os - cs,
      //       diffPct: ((cs / os) * 100 - 100).toFixed(2) + "%",
      //       diffStr: getSizeString(os - cs),
      //       size: { before: os, after: cs },
      //       format: { before: of, after: croppedMd.format },
      //       croppedUrl: croppedImage,
      //     };

      //     console.log("NEW DATA:", newData);

      //     return newData;

      //     // return !prev ? null : { ...prev };
      //   });

      setData({
        diff: os - cs,
        diffPct: ((cs / os) * 100 - 100).toFixed(2) + "%",
        diffStr: getSizeString(os - cs),
        size: { before: os, after: cs },
        format: { before: of, after: croppedMd.format },
        croppedUrl: croppedImage,
        originalUrl: originalImage,
      });
    },
    [data, originalImage]
  );

  const updateData = useCallback(
    async (_croppedImage = croppedImage) => {
      if (data !== null) {
        // await updateCroppedImageData(_croppedImage);
        console.log("CALLING UPDATE CROPPED IMAGE DATA");
        updateCroppedImageData(_croppedImage);
        return;
      }

      const [croppedMd, originalMd] = await Promise.all([
        //   getImageMetadata(croppedImage),
        getImageMetadata(_croppedImage),
        getImageMetadata(originalImage),
      ]);
      console.log("Metadata:", { croppedMd, originalMd });

      if (!croppedMd || !originalMd) {
        return;
      }

      const cs = croppedMd.size;
      const os = originalMd.size;

      if (!cs || !os) {
        return <div className="centered">Size information is required</div>;
      }

      setData({
        diff: os - cs,
        diffPct: ((cs / os) * 100 - 100).toFixed(2) + "%",
        diffStr: getSizeString(os - cs),
        size: { before: os, after: cs },
        format: { before: originalMd.format, after: croppedMd.format },
        croppedUrl: croppedImage,
        originalUrl: originalImage,
      });
    },
    [croppedImage, originalImage, updateCroppedImageData, data]
  );

  useEffect(() => {
    async function initData() {
      const [croppedMd, originalMd] = await Promise.all([
        getImageMetadata(croppedImage),
        getImageMetadata(originalImage),
      ]);
      console.log("Metadata:", { croppedMd, originalMd });

      if (!croppedMd || !originalMd) {
        return;
      }

      const cs = croppedMd.size;
      const os = originalMd.size;

      if (!cs || !os) {
        return <div className="centered">Size information is required</div>;
      }

      setData({
        diff: os - cs,
        diffPct: ((cs / os) * 100 - 100).toFixed(2) + "%",
        diffStr: getSizeString(os - cs),
        size: { before: os, after: cs },
        format: { before: originalMd.format, after: croppedMd.format },
        croppedUrl: croppedImage,
        originalUrl: originalImage,
      });
    }

    if (!data) {
      initData();
    }
  }, [originalImage, croppedImage, data]);

  async function handleChangeType(type: AllowedImageFormat) {
    if (!data) {
      return;
    }

    try {
      const res = await changeFormat(data.croppedUrl, type);
      console.log("Type change result:", res, "\n");
      if (res) {
        // setCroppedMd(deserializeMetadata(res.metadata));
        setCroppedImage(res.dataUrl);
        await updateCroppedImageData(res.dataUrl);
        // await updateData(res.dataUrl);
      }
    } catch (e) {
      console.log("Failed to change type:", e);
    }
  }

  const { croppedUrl, originalUrl, ...showData } = data || {};
  return (
    <>
      <div className="bg-white z-[100000] fixed bottom-20 shadow-md left-0 w-fit px-1 max-h-80 overflow-y-auto">
        {data && <pre>{JSON.stringify(showData, null, 2)}</pre>}
        {/* {croppedData && <pre>{JSON.stringify(croppedData, null, 2)}</pre>}
        {originalData && <pre>{JSON.stringify(originalData, null, 2)}</pre>} */}
      </div>

      <Select onValueChange={(v) => handleChangeType(v as AllowedImageFormat)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select output type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="jpeg">JPEG</SelectItem>
          <SelectItem value="webp">WEBP</SelectItem>
          <SelectItem value="png">PNG</SelectItem>
          <SelectItem value="avif">AVIF</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};

export default ImageOptimizerControls;
