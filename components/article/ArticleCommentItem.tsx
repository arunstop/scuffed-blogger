import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { MdMoreHoriz } from "react-icons/md";
import { Comment } from "../../utils/data/comment";
import { LOREM } from "../../utils/helpers/Constants";
import UserAvatar from "../user/UserAvatar";

function ArticleCommentItem({
  id,
  text,
}: // openOptionModal,
// openReplyModal,
Comment & {
  // openOptionModal: (id: string | number | null) => void;
  // openReplyModal: (id: string | number | null) => void;
}) {
  const router = useRouter();
  return (
    <div className="flex flex-row items-start gap-4">
      <UserAvatar id={id + ""} />
      <div className="flex flex-1 flex-col gap-2">
        <div className="inline-flex gap-4">
          <div className="flex flex-col">
            <span className="text-base font-bold !leading-[1.2] sm:text-lg">
              Firstname Lastn
            </span>
            <span className="text-base font-semibold !leading-[1.2] opacity-50 sm:text-lg">
              @FirstnameLastname
            </span>
          </div>
          {/* <div className="dropdown dropdown-end ml-auto"> */}
          <Link
            href={{
              pathname: router.asPath,
              query: {
                option: id,
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
          {/* </div> */}
        </div>
        <span className="text-sm sm:text-base">
          {text.length !== 0 ? text : LOREM}
        </span>
        <div className="inline-flex gap-2 sm:gap-4 items-center">
          <a
            className="btn btn-ghost aspect-square rounded-xl p-0 text-success opacity-80 hover:opacity-100"
            title="Upvote"
          >
            <FaArrowUp className="text-2xl sm:text-3xl" />
          </a>
          <a
            className="btn btn-ghost aspect-square rounded-xl p-0 text-error opacity-80 hover:opacity-100"
            title="Downvote"
          >
            <FaArrowDown className="text-2xl sm:text-3xl" />
          </a>
          <Link
            href={{
              pathname: router.asPath,
              query: {
                reply: id,
              },
            }}
            shallow
          >
            <a
              className="btn-outline btn ml-auto font-bold normal-case 
              opacity-80 hover:opacity-100 w-24 sm:w-36 text-lg sm:text-xl
              btn-sm sm:btn-md
              "
              // onClick={() => openReplyModal(id + "")}
              // href="#reply"
              role={"button"}
            >
              Reply
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ArticleCommentItem);
