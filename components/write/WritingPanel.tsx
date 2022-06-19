import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
function WritingPanel() {
  const [article, setArticle] = useState("#Heading");
  return (
    <>
      <div className="flex flex-1 flex-row mb-72">
        <article
          className="prose grow rounded-xl outline outline-offset-8 outline-2 outline-base-content/20 prose-sm md:prose !max-w-none"
        >
          <ReactMarkdown remarkPlugins={[gfm]}>{article}</ReactMarkdown>
        </article>
      </div>
      <div
        className="fixed inset-x-0 mx-auto my-4 bottom-0 h-72 flex flex-col border-2 
        bg-base-300 border-base-content/20 max-w-[60rem] rounded-xl "
      >
        <div className="flex flex-row flex-wrap p-2 gap-2 items-center justify-between">
          <div className="flex flex-row flex-wrap gap-2 flex-1">
            <span>
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
            </span>
          </div>
          <div className="flex flex-row flex-none gap-2">
          <button className="btn --btn-resp btn-outline">Hide</button>
            <button className="btn --btn-resp btn-primary">Submit</button>
          </div>
        </div>
        <textarea
          className="p-2 rounded-xl outline outline-1 outline-base-content/20 
          w-full h-full focus:outline-base-content focus:outline-2 resize-none z-20
          transition-all"
          value={article}
          onChange={(ev) => {
            setArticle(ev.target.value);
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
