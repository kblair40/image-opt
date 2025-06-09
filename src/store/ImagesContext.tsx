"use client";

import React, { useState, createContext } from "react";
import type { FileRejection } from "react-dropzone";

interface ImagesContextType {
  acceptedImages: File[];
  rejectedImages: FileRejection[];
  handleDroppedImages: (acc: File[], rej: FileRejection[]) => void;
  clearImages: () => void;
  imgToEdit?: File;
  setImgToEdit: React.Dispatch<React.SetStateAction<File | undefined>>;
}

export const ImagesContext = createContext<ImagesContextType>({
  acceptedImages: [],
  rejectedImages: [],
  handleDroppedImages: (acc: File[], rej: FileRejection[]) => {},
  clearImages: () => {},
  setImgToEdit: (f: React.SetStateAction<File | undefined>) => {},
});

const ImagesContextProvider = ({ children }: React.PropsWithChildren) => {
  const [acceptedImages, setAcceptedImages] = useState<File[]>([]);
  const [rejectedImages, setRejectedImages] = useState<FileRejection[]>([]);
  const [imgToEdit, setImgToEdit] = useState<File>();

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
