import { Transition } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import MainMarkdownContainer from "../main/MainMarkdownContainer";
import MainSectionSkeleton from "../main/MainSectionSkeleton";

function WritingPanelPreview({ content }: { content: string }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setLoaded(true);
    }, 1000);
    return () => {
      clearTimeout(loadTimer);
    };
  }, []);

  return (
    <div className="flex flex-1 flex-row self-start ">
      <Transition
        as={"div"}
        show={loaded}
        className="w-full"
        appear
        enter="ease-out transition-all absolute duration-200 origin-right"
        enterFrom="opacity-50 scale-x-50"
        enterTo="opacity-100 scale-x-100"
      >
        <MainMarkdownContainer
          content={
            decodeURIComponent(content) || "## Content will appear here..."
          }
          // className="outline outline-2 outline-offset-[1rem] outline-base-content/10"
        />
      </Transition>
      <Transition
        as={"div"}
        show={!loaded}
        className="w-full origin"
        appear
        leave="ease-in transition-all absolute duration-200"
        leaveFrom="opacity-100 scale-x-100"
        leaveTo="opacity-50 scale-x-0"
      >
        <MainSectionSkeleton text="Loading preview..." spinner />
      </Transition>
    </div>
  );
}

// const LazyMainMarkDownContainer = dynamic(
//   () => import("../main/MainMarkdownContainer"),
//   {
//     loading: () => <MainSectionSkeleton text="Loading preview..." spinner />,
//     ssr: false,
//   },
// );

export default WritingPanelPreview;
