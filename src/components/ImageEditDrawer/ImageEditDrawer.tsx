import React from "react";
// import { Crop } from "lucide-react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  //   DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import type { EditData } from "../ImageList/ImageList";

type Props = {
  data: EditData;
  onClose: () => void;
};

const ImageEditDrawer = ({ data, onClose }: Props) => {
  return (
    <Drawer open={true}>
      {/* <DrawerTrigger>
        <Crop />
      </DrawerTrigger> */}

      <DrawerContent>
      {/* <DrawerContent asChild> */}
        <div className="h-dvh max-h-dvh border-2 border-red-300">
          {/* <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader> */}
          {/* <DrawerFooter>
          </DrawerFooter> */}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ImageEditDrawer;
