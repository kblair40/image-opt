"use client";

import React, { useState, createContext } from "react";
import type { FileRejection } from "react-dropzone";

interface ImagesContextType {
  acceptedImages: File[];
  rejectedImages: FileRejection[];
  handleDroppedImages: (acc: File[], rej: FileRejection[]) => void;
  clearImages: () => void;
}

export const ImagesContext = createContext<ImagesContextType>({
  acceptedImages: [],
  rejectedImages: [],
  handleDroppedImages: (acc: File[], rej: FileRejection[]) => {},
  clearImages: () => {},
});

const ImagesContextProvider = ({ children }: React.PropsWithChildren) => {
  const [acceptedImages, setAcceptedImages] = useState<File[]>([]);
  const [rejectedImages, setRejectedImages] = useState<FileRejection[]>([]);

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
      }}
    >
      {children}
    </ImagesContext.Provider>
  );
};

export default ImagesContextProvider;
