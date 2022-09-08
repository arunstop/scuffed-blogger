import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { BsChatSquareText, BsShare } from "react-icons/bs";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { MdMoreHoriz } from "react-icons/md";
import { CommentModel } from "../../utils/data/models/CommentModel";
import {
  dateDistanceGet,
  routeTrimQuery,
  userAvatarLinkGet
} from "../../utils/helpers/MainHelpers";
import UserAvatar from "../user/UserAvatar";

function ArticleCommentItem({ comment }: { comment: CommentModel }) {
  const router = useRouter();
  const postedAt = dateDistanceGet(comment.dateAdded, Date.now());
  const userAvatar = userAvatarLinkGet(comment.userId);

  const actions: CommentActionProps[] = [
    {
      label: !comment.upvote?'':comment.upvote+"",
      icon: <FaArrowUp />,
      action: () => {},
    },
    {
      label: !comment.downvote?'':comment.downvote+"",
      icon: <FaArrowDown />,
      action: () => {},
    },
    {
      label: "Reply",
      icon: <BsChatSquareText />,
      action: () => {
        router.push(
          {
            pathname: routeTrimQuery(router.asPath),
            query: {
              reply: comment.id,
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
        alert('Link copied');
      },
    },
  ];
  return (
    <div className="flex flex-row items-start gap-4">
      <UserAvatar src={userAvatar} />
      <div className="flex flex-1 flex-col gap-2">
        <div className="inline-flex gap-4">
          <div className="flex flex-col">
            <span className="text-base font-bold !leading-[1.2] sm:text-lg capitalize">
              {comment.userName}
            </span>
            <span className="text-base font-semibold !leading-[1.2] opacity-50 sm:text-lg">
              {postedAt}
            </span>
          </div>
          {/* <div className="dropdown dropdown-end ml-auto"> */}
          <Link
            href={{
              pathname: router.asPath,
              query: {
                option: comment.id,
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
        <span className="text-sm sm:text-base">{comment.content}</span>
        <div className="flex gap-2 sm:gap-4 items-center justify-end">
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
  action?: () => void;
}

const ArticleCommentItemActionButton = ({
  label,
  icon,
  action = () => {},
}: CommentActionProps) => {
  return (
    <span
      className="btn btn-ghost rounded-xl p-2 opacity-50 hover:opacity-100
      !flex !flex-nowrap max-w-none gap-4 !h-auto aspect-square sm:aspect-auto
      group"
      title="Upvote"
      onClick={()=>action()}
    >
      {icon && <span className="text-xl sm:text-2xl">{icon}</span>}
      {label && <span className="hidden sm:block">{label}</span>}
    </span>
  );
};

export default React.memo(ArticleCommentItem);
