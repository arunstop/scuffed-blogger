import { Transition } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import MainMarkdownContainer from "../main/MainMarkdownContainer";
import LoadingIndicator from "../placeholder/LoadingIndicator";

function WritingPanelPreview({
  content,
  submit,
}: {
  content: string;
  submit: () => void;
}) {
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
    <div className="flex w-full flex-col gap-4 sm:gap-8">
      <div className="flex w-full flex-1 flex-row self-start">
        <Transition
          as={"div"}
          show={loaded}
          className="w-full"
          appear
          enter="ease-out transition-all absolute inset-x-0 duration-200 origin-right"
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
          className="origin w-full"
          appear
          leave="ease-in transition-all absolute inset-x-0 duration-200"
          leaveFrom="opacity-100 scale-x-100"
          leaveTo="opacity-50 scale-x-0"
        >
          <LoadingIndicator text="Loading preview..." spinner />
        </Transition>
      </div>
      <div className="flex w-full flex-row flex-wrap justify-end gap-2 sm:gap-4">
        {/* <button
      className="--btn-resp btn-outline btn"
      onClick={() => {
        // setContent("");
      }}
      type="button"
    >
      Reset
    </button> */}
        <button
          className="--btn-resp btn btn-primary"
          onClick={() => {
            submit();
          }}
          type="button"
        >
          Submit Article
        </button>
      </div>
    </div>
  );
}

export default WritingPanelPreview;
