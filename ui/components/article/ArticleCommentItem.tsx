import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode, useCallback, useState } from "react";
import { BsChatSquareText } from "react-icons/bs";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { MdContentCopy, MdMoreHoriz } from "react-icons/md";
import { useAuthCtx } from "../../../app/contexts/auth/AuthHook";
import { useCommentCtx } from "../../../app/contexts/comment/CommentHook";
import {
  dateDistanceGet,
  userAvatarLinkGet
} from "../../../app/helpers/MainHelpers";
import { getElById } from "../../../app/helpers/UiHelpers";
import { CommentModel } from "../../../base/data/models/CommentModel";
import UserAvatar from "../user/UserAvatar";
import IntersectionObserverTrigger from "../utils/IntesectionObserverTrigger";
import ArticleCommentItemActionButton from "./ArticleCommentItemActionButton";
import ArticleCommentReply from "./ArticleCommentReply";
interface ArticleCommentItemProps {
  comment: CommentModel;
  optionParam?: string;
  replyParam?: string;
  noActions?: boolean;
  isReply?: boolean;
}

function ArticleCommentItem({
  observe,
  ...props
}: ArticleCommentItemProps & { observe?: boolean }) {
  const [visible, setVisible] = useState(true);
  const elementId = `comment-${{ ...props }.comment.id}`;
  const element = getElById(elementId);
  return observe ? (
    <IntersectionObserverTrigger
      id={elementId}
      callback={(intersecting) => setVisible(intersecting)}
      className=""
      style={
        visible
          ? undefined
          : {
              height: `${element?.clientHeight}px`,
              width: `100%`,
            }
      }
    >
      {visible && <ArticleCommentItemContent {...props} />}
    </IntersectionObserverTrigger>
  ) : (
    <ArticleCommentItemContent {...props} />
  );
}

function ArticleCommentItemContent({
  comment,
  optionParam,
  replyParam,
  noActions = false,
  isReply,
}: ArticleCommentItemProps) {
  const router = useRouter();
  const {
    authStt: { user },
  } = useAuthCtx();
  const {
    state,
    action: { loadReplies: loadRepliesAction, reactComment },
  } = useCommentCtx();
  // const [comment, setComment] = useState(commentProps);
  const [showReplies, setShowReplies] = useState(false);
  // const [replies, setReplies] = useState<CommentModelsWithPaging>();

  const loadReplies = useCallback(async (startFrom?: number) => {
    loadRepliesAction(comment, startFrom);
    setShowReplies(true);
  }, []);

  const toggleShowReplies = useCallback(() => {
    if (showReplies) return setShowReplies(false);
    return loadReplies(0);
  }, [showReplies]);

  const postedAt = `${dateDistanceGet(comment.dateAdded, Date.now())} ago`;
  const userAvatar = userAvatarLinkGet(comment.userId);
  const upvoted = comment.upvote?.includes(user?.id || "");
  const downvoted = comment.downvote?.includes(user?.id || "");
  const repliesCount = comment.replies?.length || 0;
  const content = decodeURIComponent(comment.content);
  const replies = repliesCount
    ? state.replies?.find((e) => e.comments[0].parentCommentId === comment.id)
    : undefined;

  const actions: CommentActionProps[] = [
    {
      label: !comment.upvote?.length ? "" : comment.upvote.length + "",
      icon: <FaArrowUp />,
      className: `${upvoted && comment.upvote?.length ? "text-success" : ""}`,
      minimize: false,
      action: async () => {
        if (!user) return alert("You must login to do this action.");
        reactComment({
          type: upvoted ? "upCancel" : "up",
          comment: comment,
          userId:user.id,
        });
      },
    },
    {
      label: !comment.downvote?.length ? "" : comment.downvote.length + "",
      icon: <FaArrowDown />,
      className: `${downvoted && comment.downvote?.length ? "text-error" : ""}`,
      minimize: false,
      action: async () => {
        if (!user) return alert("You must login to do this action.");
        reactComment({
          type: downvoted ? "downCancel" : "down",
          comment: comment,
          userId:user.id,
        });
      },
    },
    {
      label: "",
      icon: <MdContentCopy />,
      action: () => {
        navigator.clipboard.writeText(comment.content);
        alert("Content copied");
      },
    },
    {
      label: "Reply",
      icon: <BsChatSquareText />,
      action: () => {
        if (!user || !replyParam)
          return alert("You must login to do this action.");
        router.push(
          {
            query: {
              ...router.query,
              [replyParam]: comment.id,
            },
          },
          undefined,
          { shallow: true },
        );
      },
    },
    // {
    //   label: "Share",
    //   icon: <BsShare />,
    //   action: () => {
    //     alert("Link copied");
    //   },
    // },
  ];
  return (
    <div
      className={
        `flex flex-col rounded-xl transition-all duration-300 ` +
        `${
          noActions
            ? ``
            : `${
                isReply
                  ? "py-2"
                  : "hover:p-2 m-1 sm:hover:p-4 sm:m-2 ease-in-out hover:bg-primary/10"
              }`
        }`
      }
    >
      <div className="flex flex-row items-stretch gap-2 sm:gap-4">
        <div className="flex flex-col">
          <div className="flex">
            <UserAvatar src={userAvatar} />
          </div>
          {/* lines */}
          {!!isReply && (
            <div className="mx-auto mt-1 h-full w-[0.3rem] rounded-full bg-base-content/20 sm:mt-2"></div>
          )}
          {/* avatar */}
        </div>
        <div className="flex flex-1 flex-col gap-1 overflow-hidden sm:gap-2">
          <div className="inline-flex gap-4">
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold  capitalize sm:text-lg">
                {comment.userName}
              </span>
              <span>&#8212;</span>
              <span className="sm:text-md text-sm  font-semibold opacity-50">
                {postedAt}
              </span>
            </div>
            {/* <div className="dropdown dropdown-end ml-auto"> */}
            {user && optionParam && (
              <Link
                href={{
                  // pathname: router.asPath,
                  query: {
                    ...router.query,
                    [optionParam]: comment.id,
                  },
                }}
                shallow
              >
                <a
                  className="btn-ghost btn ml-auto aspect-square rounded-xl p-0 opacity-80 hover:opacity-100"
                  title="Options"
                  tabIndex={0}
                  // href="#options"
                  role={"button"}
                >
                  <MdMoreHoriz className="text-2xl sm:text-3xl" />
                </a>
              </Link>
            )}
          </div>
          <span className="truncate whitespace-pre-line text-sm sm:text-base">{`${content}`}</span>
          {!noActions && (
            <div className={`flex items-center w-full `}>
              {actions.map((e, idx) => {
                return <ArticleCommentItemActionButton key={idx} {...e} />;
              })}
            </div>
          )}
          {!!repliesCount && !noActions && !comment.parentCommentId && (
            <ArticleCommentReply
              comment={comment}
              toggleShowReplies={toggleShowReplies}
              showReplies={showReplies}
              replies={replies}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export interface CommentActionProps {
  icon?: ReactNode;
  label?: string;
  className?: string;
  minimize?: boolean;
  action?: () => void;
}

export default React.memo(ArticleCommentItem);
