import React from "react";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AllowedImageType } from "@/lib/image-types";

type Props = {};

const ImageListImageActions = (props: Props) => {
  function handleClickConvert(type: AllowedImageType) {
    console.log('Convert to:', type);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {/* Advanced */}
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>Convert To...</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => handleClickConvert("jpeg")}
            className="pl-4"
          >
            JPEG
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleClickConvert("png")}
            className="pl-4"
          >
            PNG
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleClickConvert("webp")}
            className="pl-4"
          >
            WEBP
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleClickConvert("avif")}
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
