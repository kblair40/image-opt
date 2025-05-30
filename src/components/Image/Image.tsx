import React from "react";
import NextImage from "next/image";

import type { ImageProps } from "next/image";

type Props = ImageProps;

const Image = ({ src }: Props) => {
  return <div>Image</div>;
};

export default Image;
