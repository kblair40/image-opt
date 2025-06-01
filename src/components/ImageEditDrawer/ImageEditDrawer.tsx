"use client"

import React from "react";
// import { Crop } from "lucide-react";

// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   //   DrawerTrigger,
// } from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  //   SheetHeader,
  //   SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import type { EditData } from "../ImageList/ImageList";

type Props = {
  data: EditData;
  onClose: () => void;
};

const ImageEditDrawer = ({ data, onClose }: Props) => {
  return (
    <Sheet
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      {/* <SheetContent className="h-dvh max-h-11/12" side="bottom"> */}
      <SheetContent className="h-dvh" side="bottom">
        {/* <SheetHeader>
        </SheetHeader> */}

        {/* <SheetFooter>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  );
};

// const ImageEditDrawer = ({ data, onClose }: Props) => {
//   return (
//     <Drawer open={true}>
//       <DrawerContent>
//       </DrawerContent>
//     </Drawer>
//   );
// };

export default ImageEditDrawer;
