"use client";

import React from "react";
import clsx from "clsx";

import { useImagesContext } from "@/hooks/useImagesContext";
import ImageListImage from "./ImageListImage";

type Props = {};

const ImageList = (props: Props) => {
  const { clearImages, acceptedImages, rejectedImages } = useImagesContext();

  return (
    <div className="w-full">
      {acceptedImages.map((img, i) => {
        return (
          <div key={i} className="border-y border-neutral-500 py-1 px-2">
            <ImageListImage image={img} />
          </div>
        );
      })}
    </div>
  );
};

export default ImageList;
