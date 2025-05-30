"use client";

import React from "react";

import ImagesContextProvider from "@/store/ImagesContext";

function Providers({ children }: React.PropsWithChildren) {
  return <ImagesContextProvider>{children}</ImagesContextProvider>;
}

export default Providers;
