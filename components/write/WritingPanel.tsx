import { Transition } from "@headlessui/react";
import { FirebaseError } from "firebase/app";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { Fragment, ReactNode, useCallback, useEffect, useState } from "react";
import { MdEdit, MdRemoveRedEye } from "react-icons/md";
import { useAuthCtx } from "../../utils/contexts/auth/AuthHook";
import { useWritingPanelCtx } from "../../utils/contexts/writingPanel/WritingPanelHook";
import { WritingPanelTabTypes } from "../../utils/data/contexts/WritingPanelTypes";
import { MainNetworkResponse } from "../../utils/data/Main";
import { ArticleModel } from "../../utils/data/models/ArticleModel";
import { strKebabify } from "../../utils/helpers/MainHelpers";
import { transitionPullV } from "../../utils/helpers/UiTransitionHelpers";
import { scrollToTop } from "../../utils/hooks/RouteChangeHook";
import { mainApi } from "../../utils/services/network/MainApi";
import StatusPlaceholder from "../placeholder/StatusPlaceholder";
import WritingPanelForm1 from "./WritingPanelForm";
import WritingPanelPreview from "./WritingPanelPreview";

const tabs: { icon: ReactNode; title: WritingPanelTabTypes }[] = [
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
  const [loading, setLoading] = useState(false);
  const [networkResp, setNetWorkResp] =
    useState<MainNetworkResponse<ArticleModel | FirebaseError | null>>();
  const router = useRouter();
  const {
    state: { formData, tab },
    action,
  } = useWritingPanelCtx();
  const { isLoggedIn } = useAuthCtx();

  const submitArticle = useCallback(
    async () => {
      // terminate the process if formData is null
      // OR not logged in
      if (!formData || !isLoggedIn) return;
      // proceed if not
      const date = Date.now();
      const newArticle: ArticleModel = {
        id: strKebabify(`${formData.title.slice(0, 120)}-${nanoid()}`),
        title: formData.title,
        desc: formData.desc,
        content: encodeURIComponent(formData.content),
        thumbnail: `https://picsum.photos/id/${Math.floor(
          Math.random() * 10,
        )}/500/300`,
        author: "Munkrey Alf",
        dateAdded: date,
        dateUpdated: date,
        deleted: 0,
        duration: (formData.content.length || 0) / 200,
        tags: [...formData.tags.split(",").map((e) => e.trim())],
        topics: [...formData.topics.split(",").map((e) => e.trim())],
      };

      setLoading(true);

      await mainApi.addArticle({
        article: newArticle,
        callback: async (resp) => {
          if (resp.status === "success") action.clearFormData();
          setNetWorkResp(resp);
          // if (resp.status !== "loading") {
          // await waitFor(4000);
          setLoading(false);
          // }
          // if (resp.status === "success") {
          //   storageSave(KEY_ARTICLE_CONTENT, JSON.stringify(newArticle));
          // }
        },
      });
    },
    [formData, isLoggedIn],
  );

  // Scroll to top everytime there is action
  useEffect(() => {
    scrollToTop();
    return () => {};
  }, [loading, networkResp]);

  return (
    <Transition
      appear
      as="div"
      className={`flex flex-col justify-start gap-4 sm:gap-8 w-full`}
      {...transitionPullV()}
    >
      <div className="text-4xl font-bold sm:text-5xl">Write Article</div>

      <div className="relative min-w-full">
        <Transition
          show={loading}
          appear
          as={"div"}
          className="absolute inset-x-0 w-full"
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
            className="absolute inset-x-0 w-full"
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
            className="absolute inset-x-0 w-full"
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
                    action.setTab("Write");
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
                      onClick={() => action.setTab(e.title)}
                    >
                      <span className="text-2xl">{e.icon}</span>
                      <span className="first-letter:uppercase">{e.title}</span>
                    </a>
                  );
                })}
              </div>
              {/* CONTENT */}

              <div className="relative flex min-h-screen w-full flex-row gap-2 sm:gap-4">
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
                    <WritingPanelForm1
                      previewing={tab === "Preview"}
                      submit={submitArticle}
                    />
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
                      content={formData?.content || ""}
                      submit={submitArticle}
                    />
                  </div>
                </Transition>
              </div>
            </div>
          </>
        </Transition>
      </div>
    </Transition>
  );
}
export default WritingPanel;
