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
    <div className="flex flex-1 flex-row ">
      {loaded ? (
        <MainMarkdownContainer
          content={
            decodeURIComponent(content) || "## Content will appear here..."
          }
          // className="outline outline-2 outline-offset-[1rem] outline-base-content/10"
        />
      ) : (
        <MainSectionSkeleton text="Loading preview..." spinner />
      )}
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
