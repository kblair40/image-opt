import clsx from "clsx";

import ImageDropzone from "@/components/ImageDropzone/ImageDropzone";
import ImageList from "@/components/ImageList/ImageList";

function Home() {
  return (
    <div
      className={clsx(
        "pt-6"
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
        <ImageList />
      </section>
    </div>
  );
}

export default Home;
