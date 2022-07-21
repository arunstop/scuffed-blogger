import Link from "next/link";
import React from "react";
import { MdBookmarkAdd, MdForum, MdStar, MdTrendingUp } from "react-icons/md";
import MainUserPopup from "../main/MainPostUserPopup";
import PostStatusChipMini from "./PostStatusChipMini";
import PostUserLabelMini from "./PostUserLabelMini";

interface Post {
  id: string;
}

function PostItemMini({ post }: { post: Post }) {
  return (
    <div
      className="group flex w-full flex-col overflow-hidden rounded-xl bg-primary
        bg-opacity-10 shadow-lg transition-all hover:bg-opacity-40 sm:flex-row
        "
    >
      <Link href={`/article/${post.id}`} passHref>
        <a className="relative aspect-square h-32 w-full overflow-hidden sm:h-auto sm:w-48">
          <img
            className="h-full w-full max-w-none object-cover transition-transform group-hover:scale-[1.2]"
            src={`https://picsum.photos/id/${post.id}/500/300`}
            alt="Image"
            width={240}
            height={240}
          />
          <div className=" absolute left-0 bottom-0 flex flex-wrap justify-start gap-2 overflow-hidden p-2">
            <PostStatusChipMini
              icon={<MdStar className="text-xl sm:text-2xl" />}
              title="Favorited"
              color="bg-yellow-500"
            />
            <PostStatusChipMini
              icon={<MdTrendingUp className="text-xl sm:text-2xl" />}
              title="Trending"
              color="bg-red-500"
            />
            <PostStatusChipMini
              icon={<MdForum className="text-xl sm:text-2xl" />}
              title="Active"
              color="bg-blue-500"
            />
          </div>
        </a>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="dropdown-hover dropdown self-start sm:dropdown-end">
          <PostUserLabelMini id={post.id} />

          <div tabIndex={0} className="dropdown-content pt-2">
            <MainUserPopup id={post.id} />
          </div>
        </div>
        <Link href={`/article/${post.id}`} passHref>
          <a>
            <h1 className="text-xl font-black group-hover:underline sm:text-2xl">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem
              ipsum dolor sit amet, consectetur adipisicing elit.
            </h1>
          </a>
        </Link>
        <div className="flex flex-row w-full items-center gap-2 text-sm font-light sm:text-base">
          <span className="">2mins read</span>
          <span className="font-black">&middot;</span>
          <span className="">Technology</span>
          <div className="flex flex-row items-center justify-end gap-2 sm:gap-4 ml-auto">
            <button
              className="btn-neutral btn-outline btn btn-sm btn-circle 
            bg-opacity-50 text-xl font-bold normal-case opacity-80 
            group-hover:opacity-100 sm:btn-md sm:!text-3xl"
              title="Add to bookmark"
            >
              <MdBookmarkAdd />
            </button>
            <button
              className="btn-neutral btn-outline btn btn-sm w-32
              bg-opacity-50 text-base font-bold normal-case opacity-80
              group-hover:opacity-100 sm:btn-md sm:!text-xl"
            >
              Read
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostItemMini;
