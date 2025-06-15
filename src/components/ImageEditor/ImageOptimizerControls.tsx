"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { OutputInfo } from "sharp";

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

type Dims = {
  w: number;
  h: number;
};

type Size = {
  int: number;
  str: string;
};

type Data = {
  diff: number;
  diffPct: string;
  diffStr: string;
  size: { before: Size; after: Size };
  //   size: { before: number; after: number };
  format: { before: string; after: string };
  dims: { before: Dims; after: Dims };
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

      const croppedMd = await getImageMetadata(croppedImage, true);
      if (!croppedMd) {
        console.log("\nError getting cropped image metadata");
        return;
      }

      const {
        size: { before: os },
        format: { before: of },
        dims: { before },
      } = data;

      //   const cs = croppedMd.size;
      const { size: cs, height: ch, width: cw } = croppedMd;

      if (!cs || !os) {
        console.log("Failed getting original and/or cropped image sizes:", {
          cs,
          os,
        });
        return;
      }

      setData({
        diff: os.int - cs,
        diffPct: ((cs / os.int) * 100 - 100).toFixed(2) + "%",
        diffStr: getSizeString(os.int - cs),
        size: { before: os, after: { int: cs, str: getSizeString(cs) } },
        format: { before: of, after: croppedMd.format },
        croppedUrl: croppedImage,
        originalUrl: originalImage,
        dims: { before, after: { w: cw, h: ch } },
      });
    },
    [data, originalImage]
  );

  useEffect(() => {
    async function initData() {
      const [croppedMd, originalMd] = await Promise.all([
        getImageMetadata(croppedImage, true),
        getImageMetadata(originalImage),
      ]);
      //   console.log("Metadata:", { croppedMd, originalMd });

      if (!croppedMd || !originalMd) {
        return;
      }

      //   const cs = croppedMd.size;
      //   const os = originalMd.size;

      const { size: os, height: oh, width: ow } = originalMd;
      const { size: cs, height: ch, width: cw } = croppedMd;
      //   console.log("Original:", os, getSizeString(os));
      //   console.log("Cropped:", cs, getSizeString(cs));

      if (!cs || !os) {
        return <div className="centered">Size information is required</div>;
      }

      setData({
        diff: os - cs,
        diffPct: ((cs / os) * 100 - 100).toFixed(2) + "%",
        diffStr: getSizeString(os - cs),
        size: {
          before: { int: os, str: getSizeString(os) },
          after: { int: cs, str: getSizeString(cs) },
        },
        format: { before: originalMd.format, after: croppedMd.format },
        croppedUrl: croppedImage,
        originalUrl: originalImage,
        dims: { before: { w: ow, h: oh }, after: { w: cw, h: ch } },
      });
    }

    if (!data) {
      initData();
    }
  }, [originalImage, croppedImage, data]);

  useEffect(() => {
    async function fetchFile() {
      console.log("\nFETCHING FILE");
      try {
        const baseUrl = "http://localhost:3000";
        const [original, cropped] = await Promise.all([
          fetch(baseUrl + "/api/get-image-file-info", {
            method: "POST",
            body: JSON.stringify({ dataUrl: originalImage }),
          }),
          fetch(baseUrl + "/api/get-image-file-info", {
            method: "POST",
            body: JSON.stringify({ dataUrl: croppedImage }),
          }),
        ]);
        console.log("\nFetch res:", original);
        if (original.status === 200 && cropped.status === 200) {
          console.log("full res (original):", await original.json());
          console.log("full res (cropped):", await cropped.json());
        }
      } catch (e) {
        console.log("\nFailed to fetch file:", e, "\n");
      }
    }
    fetchFile();
    //   }, [originalImage]);
  });

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
