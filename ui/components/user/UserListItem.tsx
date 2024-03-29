import React from "react";
import { MdBookmarkAdd, MdPlaylistAdd } from "react-icons/md";

import Link from "next/link";
const UserListItem = ({ id }: { id: string }) => {
  return (
    <div
      className="group flex w-full flex-col rounded-xl bg-primary
      bg-opacity-10 shadow-lg transition-all hover:bg-opacity-40 sm:flex-row
  "
    >
      <Link
        as={"a"}
        href={`/list/${id}`}
        className="relative aspect-video h-60 w-full overflow-hidden 
        rounded-t-xl rounded-bl-none bg-base-content sm:h-auto sm:w-96 
        sm:rounded-l-xl sm:rounded-tr-none "
      >
        <div className="relative flex h-full justify-end gap-0.5 sm:gap-1">
          {[...Array((parseInt(id) || 0) % 2 === 0 ? 4 : 3)].map((e, idx) => (
            <div key={idx} className="flex-1 overflow-hidden bg-base-content">
              <img
                className="h-full flex-1 object-cover transition-transform 
                duration-1000 group-hover:scale-[1.2]"
                src={`https://picsum.photos/id/${idx + ""}/500/300`}
                alt="Image"
              />
            </div>
          ))}
          <div
            className="absolute bottom-0 flex max-h-32 w-full flex-wrap justify-center 
            gap-2 bg-base-100/80 p-4 text-base font-bold sm:text-lg "
          >
            <span className="">7 Articles</span>
            <span className="font-black">&middot;</span>
            <span className="">12 mins read</span>
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <Link as={"a"} href={`/list/${id}`}>
          <h1 className="text-2xl font-black group-hover:underline sm:text-3xl">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          </h1>
        </Link>
        <span className="text-base sm:text-lg">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque,
          commodi? Suscipit illum maxime, repellat inventore et distinctio
          porro.
        </span>

        <div className="flex flex-wrap gap-2 text-sm font-light sm:text-base">
          <span className="">Updated 2d ago</span>
        </div>

        <div className="mt-auto flex flex-row items-center justify-end gap-2 sm:gap-4">
          <button
            className="btn-neutral btn-outline btn btn-sm btn-circle 
            bg-opacity-50 !p-0 text-2xl font-bold opacity-80
            group-hover:opacity-100 sm:btn-md sm:!text-3xl"
            title="Add to bookmark"
          >
            <MdPlaylistAdd />
          </button>
          <button
            className="btn-neutral btn-outline btn btn-sm btn-circle
            bg-opacity-50 !p-0 text-2xl font-bold opacity-80
            group-hover:opacity-100 sm:btn-md sm:!text-3xl"
            title="Add to bookmark"
          >
            <MdBookmarkAdd />
          </button>
          <Link as={"a"} href={`/article/${id}`}>
            <button
              className="btn-neutral btn-outline btn btn-sm w-32
              bg-opacity-50 text-lg font-bold normal-case opacity-80
              group-hover:opacity-100 sm:btn-md sm:!text-xl"
            >
              View
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserListItem;
