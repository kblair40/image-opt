"use client";

import React, { useState, useEffect } from "react";
import clsx from "clsx";

import ListImage from "../Image/Image";

type Props = {
  image: File;
};

const ImageListImage = ({ image }: Props) => {
  const [imgUrl, setImgUrl] = useState<string>();
  const [dims, setDims] = useState<{ width: number; height: number }>();

  const getDims = (imgUrl: string) => {
    const img = new Image();

    img.onload = function () {
      const { width, height } = img;
      setDims({ width, height });
    };

    img.src = imgUrl;
  };

  useEffect(() => {
    const reader = new FileReader();

    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      // Do whatever you want with the file contents
      //   const binaryStr = reader.result;
      //   console.log("BIN Str:", binaryStr);
      console.log("Data URL:", reader.result);
      if (typeof reader.result === "string") {
        setImgUrl(reader.result);
        getDims(reader.result);
      }
    };
    // reader.readAsArrayBuffer(image);
    reader.readAsDataURL(image);
    console.log("TYPE:", image.type);
  }, [image]);

  //   const size = image.size;
  const kb = image.size / 1000;

  const size =
    kb >= 1000 ? (kb / 1000).toFixed(1) + "mb" : kb.toFixed(1) + " kb";
  return (
    <div
      className={clsx(
        "h-12 py-1 px-3"
        //
      )}
    >
      <p>{image.name}</p>
      <p>{size}</p>
      <p>{imgUrl}</p>

      {dims && <pre>{JSON.stringify(dims)}</pre>}

      {imgUrl && dims && (
        <ListImage
          alt="placeholder alt text"
          src={imgUrl}
          width={dims.width}
          height={dims.height}
        />
      )}
    </div>
  );
};

export default ImageListImage;
