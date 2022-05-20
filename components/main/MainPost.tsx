import Link from "next/link";
import React from "react";
import { MdBookmarkAdd, MdForum, MdStar, MdTrendingUp } from "react-icons/md";
import MainPostStatusChip from "./MainPostStatusChip";

interface Post {
  id: string;
}

function MainPost({ post }: { post: Post }) {
  return (
    <Link href={"/read"} passHref>
      <a
        className="group flex w-full flex-col overflow-hidden rounded-xl bg-primary
        bg-opacity-10 shadow-lg transition-all hover:-translate-y-2 hover:scale-[1.02]
        hover:bg-opacity-40 sm:flex-row
        "
      >
        <figure className="aspect-square h-60 w-full overflow-hidden sm:h-auto sm:w-72 relative">
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
        </figure>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex flex-row items-center gap-4">
            <div className="avatar">
              <div
                className="w-10 rounded-lg ring-1 ring-base-content 
                group-hover:rounded-[50%] sm:w-12 sm:ring-2 z-0 transition-all"
              >
                <img
                  src={`https://api.lorem.space/image/face?hash=${post.id}`}
                />
              </div>
            </div>
            <span className="text-base font-semibold sm:text-lg">
              Firstname Lastn
            </span>
          </div>
          <h1 className="text-2xl font-black group-hover:underline sm:text-3xl">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          </h1>
          <span className="text-sm sm:text-base">
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
            <button
              className="btn-neutral btn-outline btn btn-sm w-32
              bg-opacity-50 text-base font-bold normal-case opacity-80
              group-hover:opacity-100 sm:btn-md sm:!text-xl"
            >
              Read
            </button>
          </div>
        </div>
      </a>
    </Link>
  );
}

export default MainPost;
