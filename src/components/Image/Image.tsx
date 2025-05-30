import React from "react";
import NextImage from "next/image";

import type { ImageProps } from "next/image";

interface Props extends ImageProps {
    // TODO: Use ImageProps directly or add 
    // to this extension of ImageProps
}

const Image = (props: Props) => {
  return <NextImage {...props} />;
};

export default Image;
