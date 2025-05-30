"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import type { DropEvent, FileRejection } from "react-dropzone";
import clsx from "clsx";

import { Input } from "@/components/ui/input";
import { useImagesContext } from "@/hooks/useImagesContext";

const ImageDropzone = () => {
  const { handleDroppedImages } = useImagesContext();

  const handleDrop = useCallback(
    (files: File[], fileRejections: FileRejection[], e: DropEvent) => {
      console.log(
        "File(s) Dropped:",
        JSON.stringify({ files, fileRejections }, null, 2)
      );
      handleDroppedImages(files, fileRejections);
    },
    []
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop: handleDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg", "jpg"],
    },
  });

  const containerClasses = clsx(
    "h-40 w-full sm:h-60 sm:max-w-md",
    "rounded-sm",
    "border-2 border-dashed",
    isDragReject
      ? "border-red-500"
      : isDragAccept
      ? "border-emerald-600"
      : "border-neutral-400",
    "bg-neutral-50"
  );

  const rootClasses = clsx(
    "h-full w-full centered cursor-pointer"
    //
  );

  return (
    <div className={containerClasses}>
      <div {...getRootProps()} className={rootClasses}>
        <Input {...getInputProps()} />

        {isDragActive ? (
          <p>Drop your files here</p>
        ) : (
          <div className="flex gap-y-1 flex-col items-center text-sm font-medium text-neutral-600">
            <p>Drag &apos;n drop some files here</p>
            <p >Or click here to open your file picker</p>
          </div>
        )}
      </div>

      {/* <pre>
        {JSON.stringify({ ...acceptedImages, ...rejectedImages }, null, 2)}
      </pre> */}

      {/* <pre>
        {JSON.stringify(
          {
            isDragActive,
            isDragAccept,
            isDragReject,
          },
          null,
          2
        )}
      </pre> */}
    </div>
  );
};

export default ImageDropzone;
