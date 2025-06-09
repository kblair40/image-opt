"use client";

import React, { useState, createContext } from "react";
import type { FileRejection } from "react-dropzone";

import type { Metadata } from "@/lib/image-types";

export type EditData = Metadata & { image: File; dataUrl: string };

interface ImagesContextType {
  acceptedImages: File[];
  rejectedImages: FileRejection[];
  handleDroppedImages: (acc: File[], rej: FileRejection[]) => void;
  clearImages: () => void;
  imgToEdit?: EditData;
  setImgToEdit: React.Dispatch<React.SetStateAction<EditData | undefined>>;
}

export const ImagesContext = createContext<ImagesContextType>({
  acceptedImages: [],
  rejectedImages: [],
  handleDroppedImages: (acc: File[], rej: FileRejection[]) => {},
  clearImages: () => {},
  setImgToEdit: (f: React.SetStateAction<EditData | undefined>) => {},
});

const ImagesContextProvider = ({ children }: React.PropsWithChildren) => {
  const [acceptedImages, setAcceptedImages] = useState<File[]>([]);
  const [rejectedImages, setRejectedImages] = useState<FileRejection[]>([]);
  const [imgToEdit, setImgToEdit] = useState<EditData>();

  const handleDroppedImages = (
    acceptedImages: File[],
    rejectedImages: FileRejection[]
  ) => {
    setAcceptedImages(acceptedImages);
    setRejectedImages(rejectedImages);
  };

  const clearImages = () => {
    setAcceptedImages([]);
    setRejectedImages([]);
  };

  return (
    <ImagesContext.Provider
      value={{
        acceptedImages,
        rejectedImages,
        handleDroppedImages,
        clearImages,
        imgToEdit,
        setImgToEdit,
      }}
    >
      {children}
    </ImagesContext.Provider>
  );
};

export default ImagesContextProvider;
