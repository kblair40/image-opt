import React from "react";
import type { PixelCrop } from "react-image-crop";

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
};

const ImageOptimizer = ({ crop }: Props) => {
  return <div className="h-full w-full centered"></div>;
};

export default ImageOptimizer;
