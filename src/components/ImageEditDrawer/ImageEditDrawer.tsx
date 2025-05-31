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
        {/* <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader> */}
        <DrawerFooter>
          {/* <Button>Submit</Button>
          <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose> */}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ImageEditDrawer;
