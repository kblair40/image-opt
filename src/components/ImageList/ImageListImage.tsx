"use client";

import React, { useState, useEffect, useCallback } from "react";
import clsx from "clsx";
import type { ISizeCalculationResult } from "image-size/types/interface";

import ListImage from "../Image/Image";
import { getImageMetadata } from "@/actions/getImageMetadata";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ImageListImageActions from "./ImageListImageActions";

type Props = {
  image: File;
};

type Metadata = ISizeCalculationResult & { bytes: number; sizeString: string };

const ImageListImage = ({ image }: Props) => {
  const [imgUrl, setImgUrl] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [readErr, setReadErr] = useState<ProgressEvent<FileReader> | null>(
    null
  );
  const [metadata, setMetadata] = useState<Metadata>();
  const [newFileType, setNewFileType] = useState<string>();

  const getMetadata = useCallback(async () => {
    const reader = new FileReader();

    const kb = image.size / 1000;
    const sizeString =
      kb >= 1000 ? (kb / 1000).toFixed(1) + "mb" : kb.toFixed(1) + " kb";

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

        setMetadata({ ...md, sizeString, bytes: image.size } as Metadata);
      }
    };

    reader.readAsDataURL(image);
  }, [image]);

  useEffect(() => {
    getMetadata();
  }, [getMetadata]);

  return (
    <div className="flex justify-between items-center text-sm">
      <div
        className={clsx(
          "flex flex-col gap-y-1"
          //
        )}
      >
        <section>
          <p className="font-semibold">{image.name}</p>
        </section>

        <section className="flex justify-between">
          {metadata ? (
            <div className="flex items-end gap-x-4">
              <Badge variant="outline" className="font-semibold">
                {metadata.type?.toUpperCase()}
              </Badge>
              <p className="text-sm">{metadata.sizeString}</p>
              <p className="text-sm">
                {metadata.width} x {metadata.height}
              </p>
            </div>
          ) : (
            <div />
          )}
        </section>
      </div>

      <div>
        <div className="flex gap-x-2 items-center">
          {/* <Select>
            <SelectTrigger size="sm">
              <SelectValue placeholder="Image Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jpeg">JPEG</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="webp">WEBP</SelectItem>
              <SelectItem value="avif">AVIF</SelectItem>
            </SelectContent>
          </Select> */}

          <Button className="px-2.5" size="sm">
            Compress
          </Button>

          <ImageListImageActions />
        </div>
      </div>
    </div>
  );
};

export default ImageListImage;

// {/* <div
//   className={clsx(
//     "flex flex-col gap-y-1"
//     //
//   )}
// >
//   <section>
//     <p className="font-medium">{image.name}</p>
//   </section>

//   <section className="flex gap-x-4">
//     {metadata && (
//       <>
//         <Badge variant="outline" className="font-semibold">
//           {metadata.type?.toUpperCase()}
//         </Badge>
//         <p className="text-sm">{metadata.sizeString}</p>
//         <p className="text-sm">
//           {metadata.width} x {metadata.height}
//         </p>
//       </>
//     )}
//   </section>
//   {/* <p>{imgUrl}</p> */}

//   {/* {metadata && <pre>{JSON.stringify(metadata, null, 2)}</pre>} */}

//   {/* {imgUrl && metadata && (
//         <ListImage
//           alt="placeholder alt text"
//           src={imgUrl}
//           width={metadata.width}
//           height={metadata.height}
//         />
//       )} */}
// </div>; */}
