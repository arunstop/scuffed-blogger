import React from "react";
import {
  MdBookmarkAdd,
  MdForum,
  MdMoreHoriz,
  MdStar,
  MdTrendingUp,
} from "react-icons/md";
import PostLinker from "../post/PostLinker";
import PostPopupOption from "../post/PostPopupOption";
import MainPostStatusChip from "./MainPostFilterChip";
import MainUserPopup from "./MainPostUserPopup";
import MainUserLabel from "./MainUserLabel";

interface Post {
  id: string;
}

function MainPost({ post }: { post: Post }) {
  return (
    <div
      className="group flex w-full flex-col rounded-xl bg-primary
        bg-opacity-10 shadow-lg transition-all hover:bg-opacity-40 sm:flex-row
        "
    >
      <PostLinker
        href={`/article/${post.id}`}
        className="aspect-square h-60 w-full overflow-hidden sm:h-auto sm:w-72 relative bg-base-content rounded-t-xl rounded-bl-none sm:rounded-l-xl sm:rounded-tl-none"
      >
        <img
          className="h-full w-full max-w-none object-cover transition-transform group-hover:scale-[1.2]"
          src={`https://picsum.photos/id/${post.id}/500/300`}
          alt="Image"
          width={240}
          height={240}
        />
        <div className=" absolute left-0 bottom-0 flex flex-wrap justify-start gap-2 overflow-hidden p-2">
          <MainPostStatusChip
            icon={<MdStar className="text-xl sm:text-2xl" />}
            title="Favorited"
            color="bg-yellow-500"
          />
          <MainPostStatusChip
            icon={<MdTrendingUp className="text-xl sm:text-2xl" />}
            title="Trending"
            color="bg-red-500"
          />
          <MainPostStatusChip
            icon={<MdForum className="text-xl sm:text-2xl" />}
            title="Active"
            color="bg-blue-500"
          />
        </div>
      </PostLinker>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="inline-flex items-center gap-4">
          <div className="dropdown dropdown-hover sm:dropdown-end self-start">
            <MainUserLabel id={post.id} />

            <div tabIndex={0} className="dropdown-content pt-2">
              <MainUserPopup id={post.id} />
            </div>
          </div>

          <div className="dropdown dropdown-end ml-auto">
            <label
              className="btn btn-ghost aspect-square rounded-xl p-0 opacity-80 hover:opacity-100"
              title="Upvote"
              tabIndex={0}
            >
              <MdMoreHoriz className="text-2xl sm:text-3xl" />
            </label>
            <PostPopupOption />
          </div>
        </div>

        <PostLinker href={`/article/${post.id}`}>
          <h1 className="text-2xl font-black group-hover:underline sm:text-3xl">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          </h1>
        </PostLinker>
        <span className="text-base sm:text-lg">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque,
          commodi? Suscipit illum maxime, repellat inventore et distinctio
          porro.
        </span>
        <div className="flex flex-wrap gap-2 text-sm font-light sm:text-base">
          <span className="">2d ago</span>
          <span className="font-black">&middot;</span>
          <span className="">2mins read</span>
          <span className="font-black">&middot;</span>
          <span className="">Technology</span>
        </div>
        <div className="flex flex-row items-center justify-end gap-2 sm:gap-4">
          <button
            className="btn-neutral btn-outline btn btn-sm btn-circle
              bg-opacity-50 text-xl font-bold normal-case opacity-80
              group-hover:opacity-100
              sm:btn-md sm:!text-3xl"
            title="Add to bookmark"
          >
            <MdBookmarkAdd />
          </button>
          <PostLinker href={`/article/${post.id}`}>
            <button
              className="btn-neutral btn-outline btn btn-sm w-32
              bg-opacity-50 text-base font-bold normal-case opacity-80
              group-hover:opacity-100 sm:btn-md sm:!text-xl"
            >
              Read
            </button>
          </PostLinker>
        </div>
      </div>
    </div>
  );
}

export default MainPost;
