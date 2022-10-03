import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { MdSort } from "react-icons/md";
import { useAuthCtx } from "../../../../app/contexts/auth/AuthHook";
import { useCommentCtx } from "../../../../app/contexts/comment/CommentHook";
import { CommentProvider } from "../../../../app/contexts/comment/CommentProvider";
import { waitFor } from "../../../../app/helpers/DelayHelpers";
import { getElById } from "../../../../app/helpers/UiHelpers";
import {
  CommentModelListPagedSorted,
  CommentModelsSortType,
} from "../../../../base/data/models/CommentModel";
import ArticleComments from "../../../components/article/ArticleComments";
import Alert from "../../../components/common/Alert";
import Dropdown, { DropdownOption } from "../../../components/common/Dropdown";
import LayoutArticleCommentForm from "./LayoutArticleCommentForm";
import LayoutArticleCommentSectionExpandedModal from "./LayoutArticleCommentSectionExpandedModal";

function LayoutArticleCommentSection({ articleId }: { articleId: string }) {
  return (
    <CommentProvider articleId={articleId}>
      <LayoutArticleCommentSectionContent />
    </CommentProvider>
  );
}
function LayoutArticleCommentSectionContent() {
  const {
    authStt: { user },
  } = useAuthCtx();

  const {
    state: { comments: commentList, replies, articleId, sort },
    action: { loadComments },
  } = useCommentCtx();

  // const [commentList, setCommentList] = useState<CommentModelListPagedSorted>();
  const [sortedBy, setSortedBy] = useState<CommentModelsSortType>("new");
  const commentListPreview: CommentModelListPagedSorted = {
    ...commentList,
    comments: commentList?.comments.slice(0, 5) || [],
  } as CommentModelListPagedSorted;

  const sortOptions: DropdownOption[] = useMemo(
    () => [
      {
        label: "Newest first",
        action: () => {
          setSortedBy("new");
        },
      },
      {
        label: "Top comments",
        action: () => {
          setSortedBy("top");
        },
      },
    ],
    [],
  );

  function getSortedByLabel() {
    if (sortedBy === "new") return "newest first";
    if (sortedBy === "top") return "top comments";
    else return "";
  }

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
            <Dropdown options={sortOptions}>
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
            </Dropdown>
          </div>
        )}

        {user && (
          <LayoutArticleCommentForm
            articleId={articleId}
            loadComments={async () => {
              loadComments("new");
            }}
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
            loadComments();
          }}
          sortOptions={sortOptions}
        />
      )}
    </>
  );
}
export default React.memo(LayoutArticleCommentSection);
