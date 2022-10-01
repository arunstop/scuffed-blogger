import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode, useState } from "react";
import { BsChatSquareText, BsShare } from "react-icons/bs";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { MdMoreHoriz } from "react-icons/md";
import { useAuthCtx } from "../../../app/contexts/auth/AuthHook";
import { CommentModel } from "../../../base/data/models/CommentModel";
import {
  dateDistanceGet,
  userAvatarLinkGet,
} from "../../../app/helpers/MainHelpers";
import { getElById } from "../../../app/helpers/UiHelpers";
import MainIntersectionObserverTrigger from "../main/MainIntersectionObserverTrigger";
import UserAvatar from "../user/UserAvatar";
import ArticleCommentItemActionButton from "./ArticleCommentItemActionButton";
import { fbCommentReact } from "../../../app/services/CommentService";
interface ArticleCommentItemProps {
  comment: CommentModel;
  optionParam: string;
  replyParam: string;
}

function ArticleCommentItem({
  observe,
  ...props
}: ArticleCommentItemProps & { observe?: boolean }) {
  const [visible, setVisible] = useState(true);
  const elementId = `comment-${{ ...props }.comment.id}`;
  const element = getElById(elementId);
  return observe ? (
    <MainIntersectionObserverTrigger
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
    </MainIntersectionObserverTrigger>
  ) : (
    <ArticleCommentItemContent {...props} />
  );
}

function ArticleCommentItemContent({
  comment: commentProps,
  optionParam,
  replyParam,
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
  const isLoggedIn = user;

  const actions: CommentActionProps[] = [
    {
      label: !comment.upvote?.length ? "" : comment.upvote.length + "",
      icon: <FaArrowUp />,
      className: `${upvoted && comment.upvote?.length ? "text-success" : ""}`,
      minimize: false,
      action: async () => {
        if (!isLoggedIn) return alert("You must login to do this action.");
        const newComment = await fbCommentReact({
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
        if (!isLoggedIn) return alert("You must login to do this action.");
        const newComment = await fbCommentReact({
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
        if (!isLoggedIn) return alert("You must login to do this action.");
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
    {
      label: "Share",
      icon: <BsShare />,
      action: () => {
        alert("Link copied");
      },
    },
  ];
  return (
    <div className="flex flex-row items-start gap-2 sm:gap-4">
      <UserAvatar src={userAvatar} />
      <div className="flex flex-1 flex-col gap-2 overflow-hidden">
        <div className="inline-flex gap-4">
          <div className="flex flex-col">
            <span className="text-base font-bold !leading-[1.2] sm:text-lg capitalize">
              {comment.userName}
            </span>
            <span className="text-sm font-semibold !leading-[1.2] opacity-50 sm:text-md">
              {postedAt}
            </span>
          </div>
          {/* <div className="dropdown dropdown-end ml-auto"> */}
          {isLoggedIn && (
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
        <span className="text-sm sm:text-base truncate whitespace-pre-line">{`${comment.content}`}</span>
        <div className={`flex gap-2 sm:gap-4 items-center justify-end `}>
          {actions.map((e, idx) => {
            return <ArticleCommentItemActionButton key={idx} {...e} />;
          })}
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
