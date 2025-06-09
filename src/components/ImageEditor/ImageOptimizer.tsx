import React from "react";
import type { PixelCrop } from "react-image-crop";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  crop?: PixelCrop;
  dataUrl?: string;
  // dims: { width: number; height: number };
};

const ImageOptimizer = ({ crop, dataUrl }: Props) => {
  return (
    <div className="h-full w-full centered">
      {!!crop && !!dataUrl ? (
        <Image
          alt="placeholder"
          src={dataUrl}
          width={crop.width}
          height={crop.height}
        />
      ) : null}
    </div>
  );
};

export default ImageOptimizer;
