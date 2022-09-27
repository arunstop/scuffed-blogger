import React, { useMemo, useState } from "react";
import { MdRefresh } from "react-icons/md";
import ArticleComments from "../../../components/article/ArticleComments";
import MobileHeader, {
  MobileHeaderActionProps,
} from "../../../components/main/MobileHeader";
import ModalTemplate from "../../../components/modal/ModalTemplate";
import { CommentModelsWithPaging } from "../../../utils/data/models/CommentModel";
import { getElById } from "../../../utils/helpers/UiHelpers";
import { useModalRoutedBehaviorHook } from "../../../utils/hooks/ModalRoutedBehaviorHook";

function LayoutArticleCommentSectionExpandedModal({
  commentList,
  articleId,
}: {
  commentList: CommentModelsWithPaging;
  articleId: string;
}) {
  const [comments, setComments] =
    useState<CommentModelsWithPaging>(commentList);
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
      <button
        className="btn btn-ghost sm:btn-lg"
        onClick={() => {
          setModalComments(true, true);
        }}
      >
        Show more comments {commentList.comments.length}
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
          <ArticleComments commentList={comments} />
          <div className="w-full h-24">loading trigger</div>
        </div>
      </ModalTemplate>
    </>
  );
}

export default LayoutArticleCommentSectionExpandedModal;
