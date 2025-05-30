import { useContext } from "react";

import { ImagesContext } from "@/store/ImagesContext";

export const useImagesContext = () => {
  const context = useContext(ImagesContext);

  if (!context) {
    throw new Error(
      "useImagesContext must be used inside the ImagesContextProvider"
    );
  }

  return context;
};
