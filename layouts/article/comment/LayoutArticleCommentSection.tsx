import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { MdSort } from "react-icons/md";
import ArticleComments from "../../../components/article/ArticleComments";
import Alert from "../../../components/main/Alert";
import { useAuthCtx } from "../../../utils/contexts/auth/AuthHook";
import {
  CommentModelListPagedSorted,
  CommentModelsSortType,
} from "../../../utils/data/models/CommentModel";
import { waitFor } from "../../../utils/helpers/DelayHelpers";
import { getElById } from "../../../utils/helpers/UiHelpers";
import { fbCommentGet } from "../../../utils/services/network/FirebaseApi/FirebaseCommentModules";
import LayoutArticleCommentForm from "./LayoutArticleCommentForm";
import LayoutArticleCommentSectionExpandedModal from "./LayoutArticleCommentSectionExpandedModal";

function LayoutArticleCommentSection({ articleId }: { articleId: string }) {
  const {
    authStt: { user },
  } = useAuthCtx();

  const [commentList, setCommentList] = useState<CommentModelListPagedSorted>();
  const [sortedBy, setSortedBy] = useState<CommentModelsSortType>("new");
  const commentListPreview: CommentModelListPagedSorted = {
    ...commentList,
    comments: commentList?.comments.slice(0, 5) || [],
  } as CommentModelListPagedSorted;

  const loadComments = useCallback(
    async (newSortingType?: CommentModelsSortType) => {
      // define where to start
      const startFrom = newSortingType || !commentList ? 0 : commentList.offset;
      const commentsFromDb = await fbCommentGet({
        data: {
          articleId,
          start: startFrom,
          count: 5,
          sortBy: newSortingType || commentList?.sortBy || sortedBy,
        },
      });
      // console.log("commentsFromDb", commentsFromDb);
      if (commentsFromDb) {
        setCommentList((prev) => {
          // if previous value is not empty
          // and using the same sort method
          if (prev && !newSortingType) {
            return {
              ...commentsFromDb,
              comments: [...prev.comments, ...commentsFromDb.comments],
            } as CommentModelListPagedSorted;
          }
          // else
          return commentsFromDb;
        });
        // setSortedBy(sortBy || sortedBy);
      }
    },
    [commentList?.offset],
  );

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
    else return "";
  }
  // console.log("sortedBy", sortedBy);
  useEffect(() => {
    loadComments();
    return () => {};
  }, []);

  useEffect(() => {
    loadComments(sortedBy);
    return () => {};
  }, [sortedBy]);

  // console.log(user);
  // console.log("commentList", commentList);

  // console.log("render ArticleCommentSection");
  return (
    <>
      <div className="flex flex-col gap-4 sm:gap-8">
        {commentList?.comments.length && (
          <div className="flex animate-fadeIn items-center justify-between gap-2 sm:justify-start sm:gap-4 z-[1]">
            <span className="truncate text-sm font-bold sm:text-base">{`${commentList.total} Comments`}</span>
            <div className="dropdown-end dropdown">
              <label
                tabIndex={0}
                className="btn-ghost btn flex-nowrap gap-2 rounded-xl sm:gap-4 "
              >
                <label className="text-xl sm:text-2xl">
                  <MdSort />
                </label>
                <span className="truncate text-sm sm:text-base">
                  Sorted by{" "}
                  <span className="underline">{getSortedByLabel()}</span>
                </span>
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu !z-[1] w-52 rounded-xl bg-base-300 p-2 text-sm
                font-bold ring-[1px] ring-base-content/10 sm:text-base [&_a]:!rounded-xl"
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
        )}

        {user && (
          <LayoutArticleCommentForm
            articleId={articleId}
            loadComments={loadComments}
          />
        )}
        {!user && (
          <div className="my-4 flex w-full animate-fadeIn flex-col rounded-xl bg-primary/10 p-4 text-center sm:my-8 sm:p-8">
            <div className="flex w-full flex-wrap items-center justify-center gap-4 sm:gap-8">
              <span className="flex-2 w-full text-lg font-bold  sm:text-xl">
                Join us now, let us know what do you think about this amazing
                article!
              </span>
              <Link
                href={{
                  pathname: "/auth",
                }}
                passHref
              >
                <a className="--btn-resp flex-2 btn-primary btn w-full gap-2 font-bold normal-case sm:flex-[2_2_0%]">
                  Login, if have account
                </a>
              </Link>
              <Link
                href={{
                  pathname: "/auth",
                }}
                passHref
              >
                <a className="--btn-resp flex-2 btn-primary btn w-full gap-2 font-bold normal-case sm:flex-[2_2_0%]">
                  {`Register, if you don't`}
                </a>
              </Link>
            </div>
          </div>
        )}

        {!commentList?.comments.length ? (
          <Alert
            actions={[
              {
                label: "Comment",
                className: "",
                action() {
                  getElById("article-comment-input")?.focus();
                },
              },
            ]}
          >
            <span>{`No comments yet, let the people know, what's your thought about this article..`}</span>
          </Alert>
        ) : (
          <ArticleComments commentList={commentListPreview} />
        )}
      </div>
      {commentList && commentList?.total > 5 && (
        <LayoutArticleCommentSectionExpandedModal
          commentList={commentList}
          articleId={articleId}
          loadComments={async () => {
            await waitFor(300);
            await loadComments();
          }}
        />
      )}
    </>
  );
}

export default React.memo(LayoutArticleCommentSection);
