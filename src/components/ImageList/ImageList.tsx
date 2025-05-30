"use client"

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
        return <ImageListImage key={i} image={img} />;
      })}
    </div>
  );
};

export default ImageList;
