import { useEffect, useState } from "react";
import { MdSort } from "react-icons/md";
import ArticleComments from "../../../components/article/ArticleComments";
import {
  CommentModelsSortType,
  CommentModelListPagedSorted,
} from "../../../utils/data/models/CommentModel";
import { fbCommentGet } from "../../../utils/services/network/FirebaseApi/FirebaseCommentModules";
import LayoutArticleCommentForm from "./LayoutArticleCommentForm";

function LayoutArticleCommentSection({ articleId }: { articleId: string }) {
  const [commentList, setCommentList] = useState<CommentModelListPagedSorted>();
  const [sortedBy, setSortedBy] = useState<CommentModelsSortType>("new");

  const loadComments = async (sortBy?: CommentModelsSortType) => {
    const commentsFromDb = await fbCommentGet({
      data: { articleId, start: 0, count: 5, sortBy: sortedBy },
    });
    // console.log("commentsFromDb", commentsFromDb);
    if (commentsFromDb) setCommentList(commentsFromDb);
  };

  const sorts: {
    type: CommentModelsSortType | "cancel";
    label: string;
    action?: () => void;
  }[] = [
    {
      type: "new",
      label: "Newest first",
      action: () => {
        setSortedBy("new");
      },
    },
    {
      type: "top",
      label: "Top comments",
      action: () => {
        setSortedBy("top");
      },
    },
    {
      type: "cancel",
      label: "Cancel",
      // action: () => {},
    },
  ];

  function getSortedByLabel() {
    if (sortedBy === "new") return "newest first";
    if (sortedBy === "top") return "top comments";
    else return '';
  }

  useEffect(() => {
    loadComments();
  }, [sortedBy]);

  // console.log("commentList", commentList);

  // console.log("render ArticleCommentSection");
  return (
    <div className="flex flex-col gap-4 sm:gap-8">
      <div className="flex gap-2 sm:gap-4 items-center justify-between sm:justify-start">
        {commentList?.comments.length && (
          <span className="font-bold text-sm sm:text-base">{`${commentList.comments.length} Comments`}</span>
        )}
        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            className="btn btn-ghost rounded-lg gap-2 sm:gap-4 "
          >
            <label className="text-xl sm:text-2xl">
              <MdSort />
            </label>
            <span className="text-sm sm:text-base ">
              Sorted by <span className='underline'>{getSortedByLabel()}</span>
            </span>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 ring-[1px] ring-base-content bg-base-100 rounded-lg w-52
            [&_a]:!rounded-lg text-sm sm:text-base font-bold"
          >
            {sorts.map((e, idx) => {
              return (
                <li key={idx}>
                  <a
                    onClick={() => {
                      e.action?.();
                      (document.activeElement as HTMLElement).blur();
                    }}
                  >
                    {e.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <LayoutArticleCommentForm
        articleId={articleId}
        loadComments={loadComments}
      />
      <div></div>
      {commentList && <ArticleComments commentList={commentList} />}
    </div>
  );
}

export default LayoutArticleCommentSection;
