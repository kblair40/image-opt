"use client";

import React, { useState, useEffect, useCallback } from "react";
import clsx from "clsx";
import Image from "next/image";

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

const ImageListImage2 = ({ image, onClickEditImage }: Props) => {
  const [imgUrl, setImgUrl] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [readErr, setReadErr] = useState<ProgressEvent<FileReader> | null>(
    null
  );
  const [metadata, setMetadata] = useState<Metadata>();
  const [optimizedImage, setOptimizedImage] = useState<OptimizedMetadata>();

  function getSizeString(bytes?: number) {
    if (!bytes) return "?kb";
    const kb = bytes / 1000;

    return kb >= 1000 ? (kb / 1000).toFixed(1) + "mb" : kb.toFixed(1) + " kb";
  }

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
      {loading || !imgUrl ? (
        <div className="centered">
          <div className="h-6 w-6 border rounded-lg animate-spin" />
        </div>
      ) : (
        <Image
          alt={image.name}
          src={imgUrl}
          style={{ objectFit: "cover" }}
          fill
        />
      )}
    </div>
  );
};

//   return (
//     <div className="flex justify-between items-center text-sm">
//       <div
//         className={clsx(
//           "flex flex-col gap-y-1"
//           //
//         )}
//       >
//         <section>
//           <p className="font-semibold">{image.name}</p>
//         </section>

//         <section className="flex justify-between">
//           {metadata ? (
//             <div className="flex items-end gap-x-4">
//               <Badge variant="outline" className="font-semibold">
//                 {metadata.format.toUpperCase()}
//               </Badge>
//               <p className="text-sm">{getSizeString(metadata.size)}</p>
//               <p className="text-sm">
//                 {metadata.width} x {metadata.height}
//               </p>
//             </div>
//           ) : (
//             <div />
//           )}

//           {optimizedImage && (
//             <div className="flex items-end ml-4 gap-x-4">
//               <div className="">{">"}</div>
//               <p>{getSizeString(optimizedImage.metadata.size)}</p>
//               <p>
//                 ({optimizedImage.metadata.width} x{" "}
//                 {optimizedImage.metadata.height})
//               </p>
//             </div>
//           )}
//         </section>
//       </div>

//       <div>
//         <div className="flex gap-x-2 items-center">
//           <Button className="px-2.5" size="sm">
//             Compress
//           </Button>

//           <ImageListImageActions
//             loading={loading || !metadata || !imgUrl}
//             onClickCrop={() => onClickEditImage(image, metadata!, imgUrl!)}
//             onClickConvert={handleClickConvert}
//           />
//         </div>
//       </div>

//       <div className="fixed bottom-2 left-2 z-50 border-2 border-neutral-600 w-fit max-w-dvw overlow-x-auto max-h-60 overflow-y-scroll">
//         {optimizedImage && (
//           <Image
//             alt="placeholder alt text"
//             src={optimizedImage.dataUrl}
//             width={optimizedImage.metadata.width}
//             height={optimizedImage.metadata.height}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

export default ImageListImage2;
