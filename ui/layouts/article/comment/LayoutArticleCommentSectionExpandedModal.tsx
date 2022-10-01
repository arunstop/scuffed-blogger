import { isEqual } from "lodash";
import React, { useMemo, useState } from "react";
import { MdExpandMore, MdRefresh, MdSort } from "react-icons/md";
import { getElById } from "../../../../app/helpers/UiHelpers";
import { useRoutedModalHook } from "../../../../app/hooks/RoutedModalHook";
import { CommentModelsSortType, CommentModelsWithPaging } from "../../../../base/data/models/CommentModel";
import ArticleComments from "../../../components/article/ArticleComments";
import { DropdownOption } from "../../../components/main/Dropdown";
import IntersectionObserverTrigger from "../../../components/utils/IntesectionObserverTrigger";
import MobileHeader, {
  MobileHeaderActionProps
} from "../../../components/main/MobileHeader";
import ModalTemplate from "../../../components/modal/ModalTemplate";
import LoadingIndicator from "../../../components/placeholder/LoadingIndicator";

function LayoutArticleCommentSectionExpandedModal({
  commentList,
  articleId,
  loadComments,
  sortOptions,
}: {
  commentList: CommentModelsWithPaging;
  articleId: string;
  loadComments: (sortBy?: CommentModelsSortType) => Promise<void>;
  sortOptions: DropdownOption[];
}) {
  const { show: modalComments, toggle: setModalComments } =
    useRoutedModalHook("comments");
  function toTop() {
    const modalContentEl = getElById("modal-content");
    if (modalContentEl)
      return modalContentEl.scrollTo({ top: 0, behavior: "smooth" });
  }
  const headerActions: MobileHeaderActionProps[] = useMemo(
    () =>
      [
        {
          label: "Sort",
          icon: <MdSort />,
          options: sortOptions.map((e) => {
            return {
              ...e,
              action() {
                e.action?.();
                toTop();
              },
            };
          }),
        },
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
  const [loading, setLoading] = useState(false);
  return (
    <>
      {/* trigger */}
      <button
        className="btn-ghost btn mx-auto gap-2 rounded-xl bg-primary/30 transition-all hover:bg-primary/100 sm:gap-4"
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
          title={`Comments`}
          actions={headerActions}
          toTop={toTop}
        />
        <div className="flex flex-col gap-2 p-2 sm:gap-4 sm:p-4 animate-slideInUp animate-duration-300 animate-delay-[1]">
          <ArticleComments commentList={commentList} observe />
          {!loading && commentList.comments.length < commentList.total && (
            <IntersectionObserverTrigger
              key={commentList.offset}
              className="h-24 w-full "
              callback={async (intersecting) => {
                // console.log(intersecting);
                if (intersecting) {
                  setLoading(intersecting);
                  await loadComments();
                  setLoading(false);
                }
              }}
            />
          )}
          {loading && <LoadingIndicator spinner />}
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
// export default LayoutArticleCommentSectionExpandedModal;
