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
};

const ImageListImageActions = ({ onClickConvert }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>Convert To...</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => onClickConvert("jpeg")}
            className="pl-4"
          >
            JPEG
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onClickConvert("png")}
            className="pl-4"
          >
            PNG
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onClickConvert("webp")}
            className="pl-4"
          >
            WEBP
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onClickConvert("avif")}
            className="pl-4"
          >
            AVIF
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="font-medium">Advanced</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ImageListImageActions;
