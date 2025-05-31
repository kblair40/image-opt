import React from "react";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AllowedImageType } from "@/lib/image-types";

type Props = {
  onClickConvert: (type: AllowedImageType) => void;
  onClickCrop: () => void;
  loading: boolean;
};

const ImageListImageActions = ({
  onClickConvert,
  onClickCrop,
  loading,
}: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>Convert To...</DropdownMenuLabel>
        <DropdownMenuGroup className="cursor-pointer">
          <DropdownMenuItem
            onClick={() => onClickConvert("jpeg")}
            className="pl-4 cursor-pointer"
          >
            JPEG
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onClickConvert("png")}
            className="pl-4 cursor-pointer"
          >
            PNG
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onClickConvert("webp")}
            className="pl-4 cursor-pointer"
          >
            WEBP
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onClickConvert("avif")}
            className="pl-4 cursor-pointer"
          >
            AVIF
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            disabled={loading}
            onClick={onClickCrop}
            className="font-medium cursor-pointer"
          >
            Crop / Resize
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ImageListImageActions;
