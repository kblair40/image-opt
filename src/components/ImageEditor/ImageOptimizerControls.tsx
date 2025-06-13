"use client";

import React, { useState, useEffect } from "react";

import type { Metadata } from "@/lib/image-types";
import { deserializeMetadata, toBlob } from "@/lib/client-image-utils";
import { getImageMetadata } from "@/actions/getImageMetadata";
import { getImageSize, getImageEtag } from "next/dist/server/image-optimizer";

type Props = {
  dataUrl: string;
};

const ImageOptimizerControls = ({ dataUrl }: Props) => {
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<Metadata>();

  useEffect(() => {
    async function getMetadata() {
      try {
        const md = await getImageMetadata(dataUrl);
        console.log("Metadata:", md);
        if (md) {
          setMetadata(deserializeMetadata(md));
        }
      } catch (e) {
        console.warn("Failed to load metadata:", e);
      }
    }
    getMetadata();
  }, [dataUrl]);

  return (
    <>
      ImageOptimizerControls
      <div className="bg-white z-[100000] fixed bottom-0 left-0 w-fit px-1 max-h-80 overflow-y-auto">
        {metadata && <pre>{JSON.stringify(metadata, null, 2)}</pre>}
      </div>
    </>
  );
};

export default ImageOptimizerControls;
