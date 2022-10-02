import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode, useState } from "react";
import { BsChatSquareText } from "react-icons/bs";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { MdMoreHoriz } from "react-icons/md";
import { useAuthCtx } from "../../../app/contexts/auth/AuthHook";
import { CommentModel } from "../../../base/data/models/CommentModel";
import {
  dateDistanceGet,
  userAvatarLinkGet,
} from "../../../app/helpers/MainHelpers";
import { getElById } from "../../../app/helpers/UiHelpers";
import IntersectionObserverTrigger from "../utils/IntesectionObserverTrigger";
import UserAvatar from "../user/UserAvatar";
import ArticleCommentItemActionButton from "./ArticleCommentItemActionButton";
import { serviceCommentReact } from "../../../app/services/CommentService";
import ArticleCommentReply from "./ArticleCommentReply";
interface ArticleCommentItemProps {
  comment: CommentModel;
  optionParam?: string;
  replyParam?: string;
  noActions?: boolean;
  lined?: boolean;
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
  comment: commentProps,
  optionParam,
  replyParam,
  noActions = false,
  lined,
}: ArticleCommentItemProps) {
  const router = useRouter();
  const {
    authStt: { user },
  } = useAuthCtx();
  const [comment, setComment] = useState(commentProps);

  const postedAt = `${dateDistanceGet(comment.dateAdded, Date.now())} ago`;
  const userAvatar = userAvatarLinkGet(comment.userId);
  const upvoted = comment.upvote?.includes(user?.id || "");
  const downvoted = comment.downvote?.includes(user?.id || "");
  const replies = comment.replies?.length || 0;
  const content = decodeURIComponent(comment.content);

  const actions: CommentActionProps[] = [
    {
      label: !comment.upvote?.length ? "" : comment.upvote.length + "",
      icon: <FaArrowUp />,
      className: `${upvoted && comment.upvote?.length ? "text-success" : ""}`,
      minimize: false,
      action: async () => {
        if (!user) return alert("You must login to do this action.");
        const newComment = await serviceCommentReact({
          data: {
            react: upvoted ? "upCancel" : "up",
            articleId: comment.articleId,
            commentId: comment.id,
            userId: user.id,
          },
        });
        if (newComment) setComment(newComment);
      },
    },
    {
      label: !comment.downvote?.length ? "" : comment.downvote.length + "",
      icon: <FaArrowDown />,
      className: `${downvoted && comment.downvote?.length ? "text-error" : ""}`,
      minimize: false,
      action: async () => {
        if (!user) return alert("You must login to do this action.");
        const newComment = await serviceCommentReact({
          data: {
            react: downvoted ? "downCancel" : "down",
            articleId: comment.articleId,
            commentId: comment.id,
            userId: user.id,
          },
        });
        if (newComment) setComment(newComment);
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
          lined
            ? "px-2 sm:px-4 py-1 sm:py-2  hover:py-2 sm:hover:py-4 hover:bg-base-content/10"
            : "hover:p-2 m-1 sm:hover:p-4 sm:m-2 ease-in-out hover:bg-primary/10"
        }`
      }
    >
      <div className="flex flex-row gap-2 sm:gap-4 items-stretch">
        <div className="flex flex-col">
          <div className="flex">
            <UserAvatar src={userAvatar} />
          </div>
          {/* lines */}
          {!!lined && (
            <div className="w-[0.3rem] mx-auto h-full bg-base-content/20 mt-1 sm:mt-2 rounded-full"></div>
          )}
          {/* avatar */}
        </div>
        <div className="flex flex-1 flex-col overflow-hidden gap-1 sm:gap-2">
          <div className="inline-flex gap-4">
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold  sm:text-lg capitalize">
                {comment.userName}
              </span>
              <span>&#8212;</span>
              <span className="text-sm font-semibold  opacity-50 sm:text-md">
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
                  className="btn btn-ghost ml-auto aspect-square rounded-xl p-0 opacity-80 hover:opacity-100"
                  title="Options"
                  tabIndex={0}
                  // href="#options"
                  role={"button"}
                >
                  <MdMoreHoriz className="text-2xl sm:text-3xl" />
                </a>
              </Link>
            )}
            <>
              {/* <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow-xl ring-2 ring-base-content/20 bg-base-100 rounded-xl max-w-[15rem] w-max"
            >
              <li>
                <a className="">
                  <MdReport className="text-xl sm:text-2xl" />{" "}
                  <span className="text-base sm:text-lg font-bold">
                    Report comment
                  </span>
                </a>
              </li>
              <li>
                <a className="">
                  <MdDelete className="text-xl sm:text-2xl" />{" "}
                  <span className="text-base sm:text-lg font-bold">
                    Delete comment
                  </span>
                </a>
              </li>
              <li>
                <a className="">
                  <FaVolumeMute className="text-xl sm:text-2xl" />{" "}
                  <span className="text-base sm:text-lg font-bold">
                    Mute user
                  </span>
                </a>
              </li>
              <li>
                <a className="">
                  <FaVolumeUp className="text-xl sm:text-2xl" />{" "}
                  <span className="text-base sm:text-lg font-bold">
                    Unmute user
                  </span>
                </a>
              </li>
              <li>
                <a className="">
                  <MdPersonOff className="text-xl sm:text-2xl" />{" "}
                  <span className="text-base sm:text-lg font-bold">
                    Block user
                  </span>
                </a>
              </li>
              <li>
                <a className="">
                  <MdFlag className="text-xl sm:text-2xl" />{" "}
                  <span className="text-base sm:text-lg font-bold">
                    Report user
                  </span>
                </a>
              </li>
            </ul> */}
            </>
            {/* </div> */}
          </div>
          <span className="text-sm sm:text-base truncate whitespace-pre-line">{`${content}`}</span>
          {!noActions && (
            <div className={`flex items-center justify-end w-full `}>
              {actions.map((e, idx) => {
                return <ArticleCommentItemActionButton key={idx} {...e} />;
              })}
            </div>
          )}
          
        </div>
      </div>
      {!!replies && !noActions && !comment.parentCommentId && (
            <ArticleCommentReply comment={comment} />
          )}
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
