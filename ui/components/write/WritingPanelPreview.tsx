import { Transition } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useWritingPanelCtx } from "../../../app/contexts/writingPanel/WritingPanelHook";
import { scrollToTop } from "../../../app/hooks/RouteChangeHook";
import {
  ArticleModel,
  toArticleModelDraft,
} from "../../../base/data/models/ArticleModel";
import { UserModel } from "../../../base/data/models/UserModel";
import ArticleContent from "../article/ArticleContent";
// import MainMarkdownContainer from "../main/MainMarkdownContainer";
import LoadingIndicator from "../placeholder/LoadingIndicator";

function WritingPanelPreview({
  user,
  submit,
}: {
  user: UserModel;
  submit: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const {
    state: { formData },
    action: { setTab },
  } = useWritingPanelCtx();
  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setLoaded(true);
    }, 1000);
    return () => {
      clearTimeout(loadTimer);
    };
  }, []);

  if (!formData) return <></>;

  // check if content is not empty
  const article = {
    ...toArticleModelDraft(formData),
    thumbnail: formData?.thumbnail?.[0]
      ? URL.createObjectURL(formData?.thumbnail[0])
      : formData?.defaultThumbnailPreview || "",
  } as ArticleModel;

  return (
    <div className="flex w-full flex-1 flex-row self-start">
      {!formData ? (
        <button
          className="--btn-resp btn btn-link text-base-content"
          onClick={() => setTab("Write")}
        >
          There is no content to show, please add something.
        </button>
      ) : (
        <>
          <Transition
            as={"div"}
            show={loaded}
            className="flex w-full flex-col gap-4 sm:gap-8 min-h-[32rem]"
            appear
            enter="ease-out transition-all absolute inset-x-0 duration-200 origin-right"
            enterFrom="opacity-50 scale-x-50"
            enterTo="opacity-100 scale-x-100"
          >
            <ArticleContent article={article} />

            <div className="flex w-full flex-row flex-wrap justify-end gap-2 sm:gap-4">
              <button
                className="--btn-resp btn btn-primary"
                onClick={() => {
                  scrollToTop(true);
                  submit();
                }}
                type="button"
              >
                Submit Article
              </button>
            </div>
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
        </>
      )}
    </div>
  );
}

export default WritingPanelPreview;
