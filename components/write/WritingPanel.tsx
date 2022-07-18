import { Transition } from "@headlessui/react";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/router";
import React, {
  Fragment,
  ReactNode,
  useCallback,
  useEffect,
  useState
} from "react";
import { MdEdit, MdRemoveRedEye } from "react-icons/md";
import { useWritingPanelCtx } from "../../utils/contexts/writingPanel/WritingPanelHook";
import { MainNetworkResponse } from "../../utils/data/Main";
import {
  ArticleModel,
  isArticleModel
} from "../../utils/data/models/ArticleModel";
import { KEY_ARTICLE_CONTENT, LOREM } from "../../utils/helpers/Constants";
import { strKebabify } from "../../utils/helpers/MainHelpers";
import { scrollToTop } from "../../utils/hooks/RouteChangeHook";
import {
  storageGet,
  storageSave
} from "../../utils/services/local/LocalStorage";
import { mainApi } from "../../utils/services/network/MainApi";
import StatusPlaceholder from "../placeholder/StatusPlaceholder";
import WritingPanelForm1 from "./WritingPanelForm1";
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
  const [tab, setTab] = useState<string>("Write");
  const [loading, setLoading] = useState(false);
  const [networkResp, setNetWorkResp] =
    useState<MainNetworkResponse<ArticleModel | FirebaseError | null>>();
  const router = useRouter();
  const { state, action } = useWritingPanelCtx();

  // Get locally saved/drafted article
  useEffect(() => {
    let localArticle = storageGet(KEY_ARTICLE_CONTENT);
    if (localArticle) {
      try {
        localArticle = JSON.parse(localArticle);
      } catch {
        localArticle = "null";
      }
    }
    if (localArticle && isArticleModel(localArticle)) {
      const formattedArticle = localArticle as unknown as ArticleModel;
      setArticle({
        ...formattedArticle,
        content: decodeURIComponent(formattedArticle.content),
      });
    }

    return () => {};
  }, []);

  const submitArticle = useCallback(async () => {
    const date = Date.now();
    const title = article?.title || "";
    const newArticle: ArticleModel = {
      id: strKebabify(`${title.slice(0, 120)}-${date}`),
      title: article?.title || LOREM.slice(0, 120),
      desc: article?.desc || LOREM.slice(121, LOREM.length),
      content: encodeURIComponent(article?.content || ""),
      thumbnail: `https://picsum.photos/id/${Math.floor(
        Math.random() * 10,
      )}/500/300`,
      author: "Munkrey Alf",
      dateAdded: date,
      dateUpdated: date,
      deleted: 0,
      duration: (article?.content.length || 0) / 200,
      tags: ["Technology", "Photography"],
    };

    setLoading(true);

    await mainApi.addArticle({
      article: newArticle,
      callback: async (resp) => {
        setNetWorkResp(resp);
        // if (resp.status !== "loading") {
        // await waitFor(4000);
        setLoading(false);
        // }
        if (resp.status === "success") {
          storageSave(KEY_ARTICLE_CONTENT, JSON.stringify(newArticle));
        }
      },
    });
  }, [article]);

  // Scroll to top everytime there is action
  useEffect(() => {
    scrollToTop();
    return () => {};
  }, [loading, networkResp]);

  return (
    <>
      <div className="text-4xl sm:text-5xl font-bold">Write Article</div>

      <div className="min-w-full relative">
        <Transition
          show={loading}
          appear
          as={"div"}
          className="w-full absolute inset-x-0"
          enter="ease-out transform transition duration-500"
          enterFrom="opacity-0 translate-y-[20%] scale-x-0"
          enterTo="opacity-100 translate-y-0 scale-x-100"
          leave="ease-in transform transition duration-300"
          leaveFrom="opacity-100 translate-y-0 scale-x-100"
          leaveTo="opacity-0 translate-y-[20%] scale-x-0"
        >
          <StatusPlaceholder
            status="loading"
            title="Submitting article..."
            desc={
              "Adding your beautifully written article into our database. Please wait for a moment, this will be very quick"
            }
            actions={[
              {
                label: "Cancel",
                callback: () => {},
              },
            ]}
          />
        </Transition>
        <>
          <Transition
            show={!loading && networkResp?.status === "error"}
            appear
            as={"div"}
            className="w-full absolute inset-x-0"
            enter="ease-out transform transition duration-500"
            enterFrom="opacity-0 translate-y-[20%] scale-x-0"
            enterTo="opacity-100 translate-y-0 scale-x-100"
            leave="ease-in transform transition duration-300"
            leaveFrom="opacity-100 translate-y-0 scale-x-100"
            leaveTo="opacity-0 translate-y-[20%] scale-x-0"
          >
            <StatusPlaceholder
              status="error"
              title="Oops something wrong just happened..."
              desc={`${networkResp?.message} \n- - - -\n${
                networkResp?.data
                  ? "Not authenticated, in order to add article you need to be logged in first"
                  : ""
              }`}
              actions={[
                {
                  label: "Go back",
                  callback: () => {
                    setNetWorkResp(undefined);
                  },
                },
                {
                  label: "Try again",
                  callback: () => {
                    submitArticle();
                  },
                },
              ]}
            />
          </Transition>

          <Transition
            show={!loading && networkResp?.status === "success"}
            appear
            as={"div"}
            className="w-full absolute inset-x-0"
            enter="ease-out transform transition duration-500"
            enterFrom="opacity-0 translate-y-[20%] scale-x-0"
            enterTo="opacity-100 translate-y-0 scale-x-100"
            leave="ease-in transform transition duration-300"
            leaveFrom="opacity-100 translate-y-0 scale-x-100"
            leaveTo="opacity-0 translate-y-[20%] scale-x-0"
          >
            <StatusPlaceholder
              status="success"
              title="Article has been submitted!"
              desc={
                "Congratulation! We did it!\nYour beautifully written article has been added into our database for the world to read it!"
              }
              actions={[
                {
                  label: "Write again",
                  callback: () => {
                    setTab("Write");
                    setNetWorkResp(undefined);
                  },
                },
                {
                  label: "Go to the article",
                  callback: () => {
                    if (!networkResp?.data) return;
                    router.push(
                      `/article/${(networkResp.data as ArticleModel).id}`,
                    );
                  },
                },
              ]}
            />
          </Transition>
        </>
        <Transition
          show={!loading && !networkResp}
          enter="ease-out transform transition duration-500"
          enterFrom="opacity-0 translate-y-[20%] scale-x-0"
          enterTo="opacity-100 translate-y-0 scale-x-100"
          leave="ease-in transform transition duration-300"
          leaveFrom="opacity-100 translate-y-0 scale-x-100"
          leaveTo="opacity-0 translate-y-[20%] scale-x-0"
        >
          <>
            <div className="flex flex-col gap-2 sm:gap-4">
              {/* TABS */}
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
              {/* CONTENT */}

              <div className="relative flex min-h-screen flex-row gap-2 sm:gap-4 w-full">
                <Transition
                  show={tab === "Write"}
                  as={Fragment}
                  enter="ease-out transform transition absolute inset-x-0 duration-500"
                  enterFrom="opacity-0 -translate-x-[50%] scale-x-0 "
                  enterTo="opacity-100 translate-x-0 scale-x-100"
                  entered="static"
                  leave="ease-in transform transition absolute inset-x-0 duration-300"
                  leaveFrom="opacity-100 translate-x-0 scale-x-100"
                  leaveTo="opacity-0 -translate-x-[50%] scale-x-0"
                  unmount={false}
                >
                  <div className="min-w-full">
                    {/* <WritingPanelForm
                      article={article}
                      setArticle={(title, desc, content) => {
                        setArticle(
                          (s) =>
                            ({
                              ...s,
                              title,
                              desc,
                              content,
                            } as ArticleModel),
                        );
                      }}
                    /> */}
                    <WritingPanelForm1 previewing={tab === "Preview"}/>
                  </div>
                </Transition>
                <Transition
                  appear
                  as={Fragment}
                  show={tab === "Preview"}
                  enter="ease-out transform transition absolute inset-x-0 duration-500"
                  enterFrom="opacity-0 translate-x-[50%] scale-x-0"
                  enterTo="opacity-100 translate-x-0 scale-x-100"
                  leave="ease-in transform transition absolute inset-x-0 duration-300"
                  leaveFrom="opacity-100 translate-x-0 scale-x-100"
                  leaveTo="opacity-0 translate-x-[50%] scale-x-0"
                >
                  <div className="min-w-full">
                    <WritingPanelPreview
                      content={state.formData?.content || ""}
                    />
                  </div>
                </Transition>
              </div>
              <div className="flex w-full flex-row flex-wrap justify-end gap-2 sm:gap-4">
                <button
                  className="--btn-resp btn-outline btn"
                  onClick={() => {
                    // setContent("");
                  }}
                >
                  Reset
                </button>
                <button
                  className="--btn-resp btn btn-primary"
                  onClick={() => {
                    submitArticle();
                  }}
                >
                  Submit Article
                </button>
              </div>
            </div>
          </>
        </Transition>
      </div>
    </>
  );
}
export default WritingPanel;
