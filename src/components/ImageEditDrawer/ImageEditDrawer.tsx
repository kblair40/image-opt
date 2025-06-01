"use client";

import React from "react";
// import { Crop } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTitle
  // SheetHeader,
  //   SheetFooter,
  
} from "@/components/ui/sheet";
// import { AspectRatio } from "@/components/ui/aspect-ratio";
// import { Button } from "@/components/ui/button";
import type { EditData } from "../ImageList/ImageList";
import ImageCropper from "../ImageCropper/ImageCropper";

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
      <SheetContent className="h-dvh bg-white px-4 pt-6 pb-12" side="bottom">
        <SheetTitle className="invisible">
            Title
        </SheetTitle>
        {/* <SheetHeader>
            header
        </SheetHeader> */}

        <section className="h-full">
          <ImageCropper data={data} />
        </section>

        {/* <SheetFooter>
            footer
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
