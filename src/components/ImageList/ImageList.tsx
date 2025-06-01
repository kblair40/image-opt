"use client";

import React, { useState, useCallback } from "react";
import clsx from "clsx";

import { useImagesContext } from "@/hooks/useImagesContext";
import ImageListImage, { type Metadata } from "./ImageListImage";
import ImageEditDrawer from "../ImageEditDrawer/ImageEditDrawer";

type Props = {};

export type EditData = Metadata & { image: File; dataUrl: string };

const ImageList = (props: Props) => {
  const [editData, setEditData] = useState<EditData | null>(null);

  const { clearImages, acceptedImages, rejectedImages } = useImagesContext();

  const handleClickEditImage = (image: File, md: Metadata, dataUrl: string) => {
    setEditData({ image, dataUrl, ...md });
  };

  return (
    <div className="w-full">
      {acceptedImages.map((img, i) => {
        return (
          <div key={i} className="border-y border-neutral-500 py-1 px-2">
            <ImageListImage
              onClickEditImage={handleClickEditImage}
              image={img}
            />
          </div>
        );
      })}

      {editData && (
        <ImageEditDrawer onClose={() => setEditData(null)} data={editData} />
      )}
    </div>
  );
};

export default ImageList;
