import { Transition } from "@headlessui/react";
import { Fragment, ReactNode, useEffect } from "react";
import { MdEdit, MdRemoveRedEye } from "react-icons/md";
import StatusPlaceholder, {
  StatusPlaceholderProps,
} from "../../components/placeholder/StatusPlaceholder";
import WritingPanelForm from "../../components/write/WritingPanelForm";
import WritingPanelPreview from "../../components/write/WritingPanelPreview";
import { useAuthCtx } from "../../utils/contexts/auth/AuthHook";
import { useWritingPanelCtx } from "../../utils/contexts/writingPanel/WritingPanelHook";
import {
  WritingPanelFormProps,
  WritingPanelTabTypes,
} from "../../utils/data/contexts/WritingPanelTypes";
import { transitionPullV } from "../../utils/helpers/UiTransitionHelpers";
import { useNetworkAction } from "../../utils/hooks/NetworkActionHook";
import { scrollToTop } from "../../utils/hooks/RouteChangeHook";
import { ArticleSubmissionProps } from "./LayoutArticlePageEdit";

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

interface LayoutArticleFormProps {
  title: string;
  submitArticle: (props: ArticleSubmissionProps) => void;
}

function LayoutArticleForm({ title, submitArticle }: LayoutArticleFormProps) {
  const netAct = useNetworkAction<
    StatusPlaceholderProps | null,
    StatusPlaceholderProps | null
  >({ value: false, data: null });

  const {
    state: { formData, tab },
    action,
  } = useWritingPanelCtx();
  const { authStt, authAct, isLoggedIn } = useAuthCtx();

  const submit = async (data: WritingPanelFormProps) => {
    if (!authStt.user) return;
    submitArticle({
      data: data,
      userPostsRef: authStt.user.list.posts,
      setResp: netAct.setNetResp,
      clearResp: netAct.clearResp,
    });
  };
  // Scroll to top everytime there is action
  useEffect(() => {
    scrollToTop();
    return () => {};
  }, [netAct.netResp]);

  return (
    <Transition
      appear
      as="div"
      className={`flex flex-col justify-start gap-4 sm:gap-8 w-full`}
      {...transitionPullV()}
    >
      <div className="text-4xl font-bold sm:text-5xl">{title}</div>

      <div className="relative min-w-full">
        {netAct.netResp ? (
          <StatusPlaceholder {...netAct.netResp.data!} />
        ) : (
          <></>
        )}

        <Transition
          show={!netAct.netResp}
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
                      submit={submit}
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
                      submit={() => {}}
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

export default LayoutArticleForm;
