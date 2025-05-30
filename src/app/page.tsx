import clsx from "clsx";

import ImageDropzone from "@/components/ImageDropzone/ImageDropzone";

function Home() {
  return (
    <div
      className={clsx(
        "pt-6",
        // "responsive-border"
        //
      )}
    >
      {/*  */}
      {/*  */}
      <section className="flex justify-center">
        <ImageDropzone />
      </section>
    </div>
  );
}

export default Home;
