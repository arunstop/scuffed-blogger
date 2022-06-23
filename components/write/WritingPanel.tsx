import { Transition } from "@headlessui/react";
import React, {
  Fragment,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  MdCheck,
  MdClose,
  MdEdit,
  MdRemoveRedEye,
  MdWorkspaces,
} from "react-icons/md";
import { addArticle } from "../../utils/api/Api";
import { MainNetworkResponse } from "../../utils/data/Main";
import { ArticleModel } from "../../utils/data/models/Article";
import { KEY_ARTICLE_CONTENT, LOREM } from "../../utils/helpers/Constants";
import { waitFor } from "../../utils/helpers/DelayHelpers";
import { storageFind, storageSave } from "../../utils/helpers/LocalStorage";
import MainTextAreaInput from "../input/MainTextAreaInput";
import MainTextInput from "../input/MainTextInput";
import WritingPanelPreview from "./WritingPanelPreview";

const tabs: { icon: ReactNode; title: string }[] = [
  {
    icon: <MdEdit />,
    title: "Write",
  },
  {
    icon: <MdRemoveRedEye />,
    title: "Preview",
  },
];

function WritingPanel() {
  const [article, setArticle] = useState<undefined | ArticleModel>();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [content, setContent] = useState("");
  const [tab, setTab] = useState<string>("Write");
  const [showSnack, setShowSnack] = useState(false);
  const [networkResp, setNetWorkResp] = useState<
    MainNetworkResponse | undefined
  >();

  useEffect(() => {
    // console.log("test");
    let localArticle = storageFind(KEY_ARTICLE_CONTENT);
    if (localArticle) {
      try {
        localArticle = JSON.parse(localArticle);
      } catch {
        localArticle = "null";
      }
      // console.log(localArticle);
    }
    const dummyArticle = localArticle as any;
    if (dummyArticle) {
      setArticle(dummyArticle as ArticleModel);
      setTitle(dummyArticle.title);
      setDesc(dummyArticle.desc);
      setContent(decodeURIComponent(dummyArticle.content));
    }

    return () => {};
  }, []);

  const editTitle = useCallback((value: string) => {
    setTitle(value);
  }, []);
  const editDesc = useCallback((value: string) => {
    setDesc(value);
  }, []);
  const editContent = useCallback((value: string) => {
    setContent(value);
  }, []);
  const submitArticle = useCallback(
    async (article: ArticleModel) => {
      if (showSnack) return;
      // console.log(
      await addArticle({
        article: article,
        callback: async (resp) => {
          setShowSnack(true);
          setNetWorkResp(resp);
          if (resp.status !== "loading") {
            await waitFor(4000);
            setShowSnack(false);
          }
        },
      });
      // );
    },
    [showSnack],
  );

  return (
    <>
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[999] flex h-auto 
        min-h-[50vh] items-end justify-center p-2 sm:p-4 [&>*]:pointer-events-auto"
      >
        <Transition
          show={(showSnack && networkResp?.status === "loading")}
          as={Fragment}
          enter="ease-out transition-all absolute duration-[600ms]"
          enterFrom="opacity-50 translate-y-full  scale-0"
          enterTo="opacity-100 translate-y-0 scale-100"
          leave="ease-in transition-all absolute duration-300"
          leaveFrom="opacity-100 translate-y-0 scale-100"
          leaveTo="opacity-50 translate-y-full scale-0"
        >
          <div>
            <div
              className="alert flex-row items-center gap-4 bg-primary/50 py-2 text-sm 
              text-base-content ring-1 ring-base-content/20 backdrop-blur-md sm:py-4 sm:text-lg"
            >
              <MdWorkspaces className="flex-none animate-spin text-2xl sm:text-3xl" />
              <div className="!m-0">
                <span className="font-bold">{networkResp?.message}</span>
              </div>
            </div>
          </div>
        </Transition>

        <Transition
          show={(showSnack && networkResp?.status === "success")}
          as={Fragment}
          enter="ease-out transition-all absolute duration-[600ms]"
          enterFrom="opacity-50 translate-y-full  scale-0"
          enterTo="opacity-100 translate-y-0 scale-100"
          leave="ease-in transition-all absolute duration-300"
          leaveFrom="opacity-100 translate-y-0 scale-100"
          leaveTo="opacity-50 translate-y-full scale-0"
        >
          <div>
            <div
              className="alert flex-row items-center gap-4 bg-success/50 py-2 text-sm 
              text-base-content ring-1 ring-base-content/20 backdrop-blur-md sm:py-4 sm:text-lg"
            >
              <MdCheck className="flex-none text-2xl sm:text-3xl" />
              <div className="!m-0">
                <span className="font-bold">{networkResp?.message}</span>
              </div>
            </div>
          </div>
        </Transition>
        <Transition
          show={(showSnack && networkResp?.status === "error")}
          as={Fragment}
          enter="ease-out transition-all absolute duration-[600ms]"
          enterFrom="opacity-50 translate-y-full  scale-0"
          enterTo="opacity-100 translate-y-0 scale-100"
          leave="ease-in transition-all absolute duration-300"
          leaveFrom="opacity-100 translate-y-0 scale-100"
          leaveTo="opacity-50 translate-y-full scale-0"
        >
          <div>
            <div
              className="alert flex-row items-center gap-4 bg-error/50 py-2 text-sm 
              text-base-content ring-1 ring-base-content/20 backdrop-blur-md sm:py-4 sm:text-lg"
            >
              <MdClose className="flex-none text-2xl sm:text-3xl" />
              <div className="!m-0">
                <span className="font-bold">{networkResp?.data as string}</span>
              </div>
            </div>
          </div>
        </Transition>
      </div>
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
        </div>
        <div className="relative flex min-h-screen flex-row gap-2 sm:gap-4">
          <Transition
            show={tab === "Write"}
            as={Fragment}
            enter="ease-out transition-all absolute duration-[600ms]"
            enterFrom="opacity-0 -translate-x-[50%] scale-x-0 "
            enterTo="opacity-100 translate-x-0 scale-x-100scale-100"
            leave="ease-in transition-all absolute duration-300"
            leaveFrom="opacity-100 translate-x-0 scale-x-100scale-100"
            leaveTo="opacity-0 -translate-x-[50%] scale-x-0"
          >
            <div className="flex w-full flex-col gap-4">
              <span className="text-xl font-bold sm:text-2xl">Title</span>
              <MainTextInput
                scaleTo="md"
                value={title}
                placeholder="Very lucrative and straight-forward sentence..."
                onChange={(ev) => editTitle(ev.target.value)}
              />
              <span className="text-xl font-bold sm:text-2xl">Description</span>
              <MainTextAreaInput
                placeholder="This article talks about something interesting..."
                className="!h-32 max-h-32"
                value={desc}
                onChange={(ev) => editDesc(ev.target.value)}
              />
              <span className="text-xl font-bold sm:text-2xl">Content</span>
              <MainTextAreaInput
                className="min-h-[36rem] resize-none"
                placeholder="Write the article's content"
                value={content}
                onChange={(ev) => editContent(ev.target.value)}
              />
            </div>
          </Transition>
          <Transition
            as={Fragment}
            appear
            show={tab === "Preview"}
            enter="ease-out transition-all absolute duration-[600ms]"
            enterFrom="opacity-0 translate-x-[50%] scale-x-0"
            enterTo="opacity-100 translate-x-0 scale-x-100scale-100"
            leave="ease-in transition-all absolute duration-300"
            leaveFrom="opacity-100 translate-x-0 scale-x-100scale-100"
            leaveTo="opacity-0 translate-x-[50%] scale-x-0"
          >
            <div className="flex w-full flex-1 flex-row ">
              <WritingPanelPreview content={content} />
            </div>
          </Transition>
        </div>
        <div className="flex w-full flex-row flex-wrap justify-end gap-2 sm:gap-4">
          <button
            className="--btn-resp btn-outline btn"
            onClick={() => {
              setContent("");
            }}
          >
            Reset
          </button>
          <button
            className="--btn-resp btn btn-primary"
            onClick={() => {
              // if (article) {
              const draft: ArticleModel = {
                title: title || LOREM.slice(0, 120),
                desc: desc || LOREM.slice(121, LOREM.length),
                content: encodeURIComponent(content),
                thumbnail: `https://picsum.photos/id/${Math.floor(
                  Math.random() * 10,
                )}/500/300`,
                author: "Munkrey Alf",
                dateAdded: Date.now(),
                dateUpdated: Date.now(),
                deleted: 0,
                duration: content.length / 200,
                tags: ["Technology", "Photography"],
              };
              submitArticle(draft);
              storageSave(KEY_ARTICLE_CONTENT, JSON.stringify(draft));
            }}
          >
            Submit Article
          </button>
        </div>
      </div>
    </>
  );
}
export default WritingPanel;
