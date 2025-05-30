"use client";

import React, { useState, createContext } from "react";

interface ImagesContextType {
  acceptedImages: File[];
  rejectedImages: File[];
}

export const ImagesContext = createContext<ImagesContextType>({
  acceptedImages: [],
  rejectedImages: [],
});

const ImagesContextProvider = ({ children }: React.PropsWithChildren) => {
  const [acceptedImages, setAcceptedImages] = useState<File[]>([]);
  const [rejectedImages, setRejectedImages] = useState<File[]>([]);

  return (
    <ImagesContext.Provider
      value={{
        acceptedImages,
        rejectedImages,
      }}
    >
      {children}
    </ImagesContext.Provider>
  );
};

export default ImagesContextProvider;
