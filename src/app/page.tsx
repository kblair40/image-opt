import clsx from "clsx";

import ImageDropzone from "@/components/ImageDropzone/ImageDropzone";
// import ImageList from "@/components/ImageList/ImageList";
import ImageList2 from "@/components/ImageList/ImageList2";

function Home() {
  return (
    <div
      className={clsx(
        "pt-6",
        "flex flex-col gap-y-8",
        "px-4 sm:px-6"
        // "responsive-border"
        //
      )}
    >
      {/*  */}
      {/*  */}
      <section className="flex justify-center">
        <ImageDropzone />
      </section>

      <section>
        <ImageList2 />
        {/* <ImageList /> */}
      </section>
    </div>
  );
}

export default Home;
