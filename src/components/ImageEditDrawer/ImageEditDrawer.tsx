"use client";

import React from "react";
import { Crop } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  // SheetHeader,
  //   SheetFooter,
} from "@/components/ui/sheet";
// import { AspectRatio } from "@/components/ui/aspect-ratio";
// import { Button } from "@/components/ui/button";
import type { EditData } from "../ImageList/ImageList";
import ImageEditor from "../ImageEditor/ImageEditor";
import { cn } from "@/lib/utils";
import { useImagesContext } from "@/hooks/useImagesContext";

const ImageEditDrawer = () => {
  const { imgToEdit, setImgToEdit } = useImagesContext();

  return (
    <Sheet
      // open={true}
      open={!!imgToEdit}
      onOpenChange={(open) => {
        // if (!open) onClose();
        if (!open) setImgToEdit(undefined);
      }}
    >
      {/* <SheetContent className="h-dvh max-h-11/12" side="bottom"> */}
      <SheetContent
        // className="border-4 bg-white px-4 pt-0 pb-0"
        className={cn("h-dvh max-h-dvh overflow-hidden border-4 bg-white p-0")}
        side="bottom"
      >
        <div className="flex flex-col w-full h-dvh">
          <SheetTitle className="invisible h-0">Title</SheetTitle>

          <section className="h-dvh">
            {imgToEdit && <ImageEditor data={imgToEdit} />}
          </section>
        </div>

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
