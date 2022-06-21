import { Transition } from "@headlessui/react";
import React, { Fragment, ReactNode, useEffect, useState } from "react";
import { MdEdit, MdPreview } from "react-icons/md";
import { ArticleModel } from "../../utils/data/models/Article";
import { KEY_ARTICLE_CONTENT, LOREM } from "../../utils/helpers/Constants";
import { storageFind, storageSave } from "../../utils/helpers/LocalStorage";
import MainTextAreaInput from "../input/MainTextAreaInput";
import MainTextInput from "../input/MainTextInput";
import MainMarkdownContainer from "../main/MainMarkdownContainer";

const tabs: { icon: ReactNode; title: string }[] = [
  {
    icon: <MdEdit />,
    title: "Write",
  },
  {
    icon: <MdPreview />,
    title: "Preview",
  },
];

function WritingPanel() {
  const [article, setArticle] = useState<undefined | ArticleModel>();
  const [content, setContent] = useState("");
  const [tab, setTab] = useState<string>("Write");

  useEffect(() => {
    const dummyArticle = JSON.parse(storageFind(KEY_ARTICLE_CONTENT));
    if (dummyArticle) {
      setArticle(dummyArticle as ArticleModel);
      setContent(dummyArticle.content);
    }

    return () => {};
  }, []);

  return (
    <>
      <div className="flex flex-col gap-2 sm:gap-4">
        <div className="tabs tabs-boxed w-full rounded-xl">
          {tabs.map((e, idx) => {
            return (
              <a
                key={idx}
                className={`tab tab-lg flex-1 sm:flex-none  text-lg sm:text-xl !rounded-xl 
                font-bold transition-colors gap-2
                ${e.title === tab ? "tab-active" : ""}`}
                onClick={() => setTab(e.title)}
              >
                <span className="text-2xl">{e.icon}</span>
                <span className="first-letter:uppercase">{e.title}</span>
              </a>
            );
          })}
          <div className="ml-auto my-auto flex flex-none flex-row gap-2">
            <button className="--btn-resp btn-outline btn">Hide</button>
            <button
              className="--btn-resp btn btn-primary"
              onClick={() => {
                if (article) {
                  const draft: ArticleModel = {
                    title: LOREM.slice(0, 120),
                    desc: LOREM.slice(121, LOREM.length),
                    content: content,
                    thumbnail: `https://picsum.photos/id/${Math.floor(
                      Math.random() * 10,
                    )}/500/300`,
                    author: "Munkrey Alf",
                    dateAdded: Date.now(),
                    dateUpdated: Date.now(),
                    deleted: 0,
                    duration: decodeURIComponent(article.content).length / 200,
                    tags: ["Technology", "Photography"],
                  };
                  storageSave(KEY_ARTICLE_CONTENT, JSON.stringify(draft));
                  alert("Saved");
                }
              }}
            >
              Submit
            </button>
          </div>
        </div>
        <div className="flex flex-row gap-2 sm:gap-4 relative">
          <Transition
            show={tab === "Write"}
            as={Fragment}
            enter="ease-out transition-all absolute duration-500"
            enterFrom="opacity-50 -translate-x-[120%] "
            enterTo="opacity-100 translate-x-0 "
            leave="ease-in transition-all absolute duration-500"
            leaveFrom="opacity-100 translate-x-0 "
            leaveTo="opacity-50 -translate-x-[120%] "
          >
            <div className="flex w-full flex-col gap-4">
              <span>Title</span>
              <MainTextInput
                scaleTo="md"
                placeholder="Very lucrative and straight-forward sentence..."
              />
              <span>Description</span>
              <MainTextAreaInput
                placeholder="This article talks about something interesting..."
                className="!h-32 max-h-32"
              />
              <span>Content</span>
              <textarea
                className="min-h-[30rem] w-full resize-none rounded-xl 
                p-2 outline outline-1 outline-base-content/20 transition-all focus:outline-2
                focus:outline-base-content"
                placeholder="Write the article's content"
                value={decodeURIComponent(content)}
                onChange={(ev) => {
                  setContent(encodeURIComponent(ev.target.value));
                }}
              />
            </div>
          </Transition>
          <Transition
            as={Fragment}
            appear
            show={tab === "Preview"}
            enter="ease-out transition-all absolute duration-500"
            enterFrom="opacity-50 translate-x-[120%] "
            enterTo="opacity-100 translate-x-0 "
            leave="ease-in transition-all absolute duration-500"
            leaveFrom="opacity-100 translate-x-0 "
            leaveTo="opacity-50 translate-x-[120%] "
          >
            <div className="flex flex-1 flex-row ">
              <MainMarkdownContainer
                content={
                  decodeURIComponent(content) ||
                  "## Content will appear here..."
                }
                // className="outline outline-2 outline-offset-[1rem] outline-base-content/10"
              />
            </div>
          </Transition>
        </div>
      </div>
      {/* <div className="mb-80 flex flex-1 flex-row">
        <MainMarkdownContainer
          content={
            decodeURIComponent(content) || "## Content will appear here..."
          }
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
            
          </div>
          <div className="flex flex-none flex-row gap-2">
            <button className="--btn-resp btn-outline btn">Hide</button>
            <button
              className="--btn-resp btn btn-primary"
              onClick={() => {
                if (article) {
                  const draft: ArticleModel = {
                    title: LOREM.slice(0, 120),
                    desc: LOREM.slice(121, LOREM.length),
                    content: content,
                    thumbnail: `https://picsum.photos/id/${Math.floor(
                      Math.random() * 10,
                    )}/500/300`,
                    author: "Munkrey Alf",
                    dateAdded: Date.now(),
                    dateUpdated: Date.now(),
                    deleted: 0,
                    duration: decodeURIComponent(article.content).length / 200,
                    tags: ["Technology", "Photography"],
                  };
                  storageSave(KEY_ARTICLE_CONTENT, JSON.stringify(draft));
                  alert("Saved");
                }
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
      </div> */}
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
