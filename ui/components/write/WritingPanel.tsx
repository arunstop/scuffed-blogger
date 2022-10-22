import { Transition } from "@headlessui/react";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/router";
import { Fragment, ReactNode, useCallback, useEffect } from "react";
import { MdEdit, MdRemoveRedEye } from "react-icons/md";
import { useAuthCtx } from "../../../app/contexts/auth/AuthHook";
import { useWritingPanelCtx } from "../../../app/contexts/writingPanel/WritingPanelHook";
import { waitFor } from "../../../app/helpers/DelayHelpers";
import { autoRetry } from "../../../app/helpers/MainHelpers";
import { transitionPullV } from "../../../app/helpers/UiTransitionHelpers";
import { useNetworkAction } from "../../../app/hooks/NetworkActionHook";
import { scrollToTop } from "../../../app/hooks/RouteChangeHook";
import { serviceArticleAdd } from "../../../app/services/ArticleService";
import {
  WritingPanelFormProps,
  WritingPanelTabTypes
} from "../../../base/data/contexts/WritingPanelTypes";
import { MainNetworkResponse } from "../../../base/data/Main";
import { ArticleModel } from "../../../base/data/models/ArticleModel";
import { UserModel } from "../../../base/data/models/UserModel";
import StatusPlaceholder, {
  StatusPlaceholderProps
} from "../placeholder/StatusPlaceholder";
import WritingPanelForm from "./WritingPanelForm";
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
  // const [loading, setLoading] = useState(false);
  // const [networkResp, setNetWorkResp] =
  //   useState<MainNetworkResponse<ArticleModel | FirebaseError | null>>();
  const router = useRouter();
  const {
    state: { formData, tab },
    action,
  } = useWritingPanelCtx();
  const { authStt, authAct, isLoggedIn } = useAuthCtx();
  const { loading, setLoading, netResp, setNetResp, stopLoading, clearResp } =
    useNetworkAction<
      StatusPlaceholderProps | null,
      StatusPlaceholderProps | null
    >({ value: false, data: null });

  function respLoading(title: string, desc: string) {
    return setNetResp({
      status: "loading",
      message: "Processing your request",
      data: {
        status: "loading",
        title: title,
        desc: desc,
      },
    });
  }
  function respError(
    resp: MainNetworkResponse<ArticleModel | FirebaseError | null>,
  ) {
    return setNetResp({
      status: resp.status,
      message: resp.message,
      data: {
        status: "error",
        title: "Oops something wrong just happened...",
        desc: `${resp.message} \n- - - -\n${
          resp.data
            ? "Not authenticated, in order to add article you need to be logged in first"
            : ""
        }`,
        actions: [
          {
            label: "Go back",
            callback: () => {
              clearResp();
            },
          },
          {
            label: "Try again",
            callback: () => {
              submitArticle();
            },
          },
        ],
      },
    });
  }
  function respSuccess(
    resp: MainNetworkResponse<ArticleModel | FirebaseError | null>,
  ) {
    action.clearFormData();

    return setNetResp({
      status: resp.status,
      message: resp.message,
      data: {
        status: "success",
        title: "Article has been submitted!",
        desc: "Congratulations! We did it!\nYour beautifully written article has been added into our database for the world to read it!",
        actions: [
          {
            label: "Write again",
            callback: () => {
              action.setTab("Write");
              clearResp();
            },
          },
          {
            label: "Go to the article",
            callback: () => {
              if (!resp.data) return;
              router.push(`/article/${(resp.data as ArticleModel).slug}`);
            },
          },
          {
            label: "Go to My Posts",
            callback: () => {
              router.push("/user/posts");
            },
          },
        ],
      },
    });
  }

  const submitArticle = useCallback(
    async (data?: WritingPanelFormProps) => {
      // if param data exist (data from form), use it
      // if not use the current formData state from WritingPanel context
      const processedData = data || formData;

      // terminate the processedData is empty
      if (!processedData) return;

      respLoading(
        "Creating your well written article",
        "Adding your beautifully written article into our database. Please wait for a moment, this will be very quick",
      );

      const newArticle = await autoRetry(async (attempt, max) => {
        // Auth required
        if (!authStt.user) return null;
        return await serviceArticleAdd({
          rawArticle: processedData,
          // correct non-null assertion becase we know that isLoggedIn already true
          user: authStt.user,
          callback: async (resp) => {
            // change loading state, if it's loading, no need to wait
            if (resp.status !== "loading") await waitFor(2000);

            // if it success, clear the formData state
            if (resp.status === "loading")
              respLoading(
                resp.message,
                netResp?.data?.desc || "Processing your request...",
              );
            if (resp.status === "success") respSuccess(resp);
            if (resp.status === "error") respError(resp);
          },
        });
      });

      if (!newArticle) return;
      const user = authStt.user;
      if (!user) return;
      // apply new article to the local user data
      const updatedUser: UserModel = {
        ...user,
        dateUpdated: newArticle.dateAdded,
      };
      authAct.setUser(updatedUser);
    },
    [formData, isLoggedIn],
  );

  // Scroll to top everytime there is action
  useEffect(() => {
    scrollToTop();
    return () => {};
  }, [netResp]);

  return (
    <Transition
      appear
      as="div"
      className={`flex flex-col justify-start gap-4 sm:gap-8 w-full`}
      {...transitionPullV()}
    >
      <div className="text-4xl font-bold sm:text-5xl hidden sm:block">
        {!loading && !netResp + ""}
        Write Article
      </div>

      <div className="relative min-w-full">
        {netResp?.data && <StatusPlaceholder {...netResp.data} />}
        <Transition
          show={!netResp}
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
                    <WritingPanelForm
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
                      submit={submitArticle}
                      user={authStt.user!}
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
