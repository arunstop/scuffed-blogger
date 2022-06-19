import React, { useEffect, useState } from "react";
import { KEY_ARTICLE_CONTENT } from "../../utils/helpers/Constants";
import { storageFind, storageSave } from "../../utils/helpers/LocalStorage";
import MainMarkdownContainer from "../main/MainMarkdownContainer";
function WritingPanel() {
  const [content, setContent] = useState("");

  useEffect(() => {
    setContent(storageFind(KEY_ARTICLE_CONTENT)||"");

    return () => {};
  }, []);

  return (
    <>
      <div className="mb-80 flex flex-1 flex-row">
        <MainMarkdownContainer
          content={decodeURIComponent(content)|| "## Content will appear here..."}
          className="outline outline-2 outline-offset-[1rem] 
          outline-base-content/10"
        />
      </div>
      <div
        className="fixed inset-x-0 bottom-0 mx-auto my-4 flex h-72 max-w-[60rem] flex-col 
        rounded-xl border-2 border-base-content/20 bg-base-300 "
      >
        <div className="flex flex-row flex-wrap items-center justify-between gap-2 p-2">
          <div className="flex flex-1 flex-row flex-wrap gap-2">
            {/* <span>
              <button>A</button>
            </span>
            <span>
              <button>A</button>
            </span>
            <span>
              <button>A</button>
            </span>
            <span>
              <button>A</button>
            </span> */}
          </div>
          <div className="flex flex-none flex-row gap-2">
            <button className="--btn-resp btn-outline btn">Hide</button>
            <button
              className="--btn-resp btn btn-primary"
              onClick={() => {
                storageSave(KEY_ARTICLE_CONTENT, content);
                alert("Saved");
              }}
            >
              Submit
            </button>
          </div>
        </div>
        <textarea
          className="z-20 h-full w-full resize-none rounded-xl 
          p-2 outline outline-1 outline-base-content/20 transition-all focus:outline-2
          focus:outline-base-content"
          placeholder="Write the article's content"
          value={decodeURIComponent(content)}
          onChange={(ev) => {
            setContent(encodeURIComponent(ev.target.value));
          }}
        />
      </div>
    </>
    // <div className="flex flex-1  flex-row items-stretch">
    //   <textarea
    //     className="min-w-[50%] flex-1 rounded-l-xl p-4 focus:z-10"
    //     value={article}
    //     onChange={(ev) => {
    //       setArticle(ev.target.value);
    //     }}
    //   />
    //   <article
    //     className="prose max-w-[50%] flex-1 rounded-xl border-2 border-base-content/20 p-4
    //     lg:prose-xl"
    //   >
    //     <ReactMarkdown remarkPlugins={[gfm]}>{article}</ReactMarkdown>
    //   </article>
    // </div>
  );
}

export default WritingPanel;
