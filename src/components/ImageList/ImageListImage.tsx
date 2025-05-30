"use client";

import React, { useState, useEffect, useCallback } from "react";
import clsx from "clsx";
import type { ISizeCalculationResult } from "image-size/types/interface";

import ListImage from "../Image/Image";
import { getImageMetadata } from "@/actions/getImageMetadata";
import { Badge } from "@/components/ui/badge";

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
    <div
      className={clsx(
        "flex flex-col gap-y-1"
        //
      )}
    >
      <section>
        <p className="font-medium">{image.name}</p>
      </section>

      <section className="flex gap-x-4">
        {metadata && (
          <>
            <Badge variant="outline" className="font-semibold">{metadata.type?.toUpperCase()}</Badge>
            <p className="text-sm">{metadata.sizeString}</p>
            <p className="text-sm">{metadata.width} x {metadata.height}</p>
          </>
        )}
      </section>
      {/* <p>{imgUrl}</p> */}

      {/* {metadata && <pre>{JSON.stringify(metadata, null, 2)}</pre>} */}

      {/* {imgUrl && metadata && (
        <ListImage
          alt="placeholder alt text"
          src={imgUrl}
          width={metadata.width}
          height={metadata.height}
        />
      )} */}
    </div>
  );
};

export default ImageListImage;
