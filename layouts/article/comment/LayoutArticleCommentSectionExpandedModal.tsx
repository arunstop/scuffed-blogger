import { isEqual } from "lodash";
import React, { useMemo } from "react";
import { MdExpandMore, MdRefresh } from "react-icons/md";
import ArticleComments from "../../../components/article/ArticleComments";
import MobileHeader, { MobileHeaderActionProps } from "../../../components/main/MobileHeader";
import ModalTemplate from "../../../components/modal/ModalTemplate";
import {
  CommentModelsSortType,
  CommentModelsWithPaging,
} from "../../../utils/data/models/CommentModel";
import { getElById } from "../../../utils/helpers/UiHelpers";
import { useModalRoutedBehaviorHook } from "../../../utils/hooks/ModalRoutedBehaviorHook";

function LayoutArticleCommentSectionExpandedModal({
  commentList,
  articleId,
  loadComments,
}: {
  commentList: CommentModelsWithPaging;
  articleId: string;
  loadComments: (sortBy?: CommentModelsSortType) => void;
}) {
  console.log("render this");
  const { show: modalComments, toggle: setModalComments } =
    useModalRoutedBehaviorHook("comments");
  const headerActions: MobileHeaderActionProps[] = useMemo(
    () =>
      [
        {
          label: "Reload",
          icon: <MdRefresh />,
          action() {
            alert("should refresh ");
          },
        },
      ] as MobileHeaderActionProps[],
    [],
  );
  return (
    <>
      {/* trigger */}
      <button
        className="btn btn-ghost bg-primary/30 hover:bg-primary/100 transition-all gap-2 sm:gap-4 rounded-xl mx-auto"
        onClick={() => {
          setModalComments(true, true);
        }}
      >
        <MdExpandMore className="text-2xl sm:text-3xl" />
        <span className="text-sm sm:text-base">Show more comments</span>
      </button>
      <ModalTemplate
        value={modalComments}
        onClose={() => {
          setModalComments(false);
        }}
        title={`Comments`}
      >
        <MobileHeader
          back={() => {
            setModalComments(false);
          }}
          title="Comments"
          actions={headerActions}
          toTop={() => {
            const modalContentEl = getElById("modal-content");
            if (modalContentEl)
              return modalContentEl.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
        <div className="flex flex-col gap-2 sm:gap-4 p-2 sm:p-4">
          <ArticleComments commentList={commentList} />
          <div
            className="w-full h-24"
            onClick={() => {
              loadComments("top");
            }}
          >
            loading trigger
          </div>
        </div>
      </ModalTemplate>
    </>
  );
}

export default React.memo(
  LayoutArticleCommentSectionExpandedModal,
  (prev, next) => {
    // console.log("prev", prev);
    // console.log("next", next);
    const propsAreEqual = isEqual(prev.commentList, next.commentList);
    // console.log(propsAreEqual);

    return propsAreEqual;
  },
);
