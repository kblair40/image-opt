"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import type { DropzoneOptions, DropEvent, FileRejection } from "react-dropzone";
// import type {DragHandlerArgs}
import clsx from "clsx";

import { Input } from "@/components/ui/input";

type Props = {};

const ALLOWED_FILE_TYPES = [".png", ".jpeg", ".jpg"];

const ImageDropzone = (props: Props) => {
  const handleDrop = useCallback(
    (files: File[], fileRejections: FileRejection[], e: DropEvent) => {
      console.log(
        "File(s) Dropped:",
        JSON.stringify({ files, fileRejections }, null, 2)
      );
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
    "border-2 border-dashed",
    isDragReject
      ? "border-red-500"
      : isDragAccept
      ? "border-emerald-600"
      : "border-neutral-600"
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
          <p>Drag &apos;n drop some files here</p>
        )}
      </div>

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
