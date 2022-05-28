import React from "react";
import { MdBookmarkAdd, MdPlaylistAdd } from "react-icons/md";
import PostLinker from "../post/PostLinker";

const UserList = ({ id }: { id: string }) => {
  return (
    <div
      className="group flex w-full flex-col rounded-xl bg-primary
      bg-opacity-10 shadow-lg transition-all hover:bg-opacity-40 sm:flex-row
  "
    >
      <PostLinker
        href={`/article/${id}`}
        className="relative aspect-video h-60 w-full overflow-hidden 
        bg-base-content sm:h-auto sm:w-96 rounded-t-xl rounded-bl-none 
        sm:rounded-l-xl sm:rounded-tr-none "
      >
        <div className="flex gap-0.5 sm:gap-1 justify-end h-full">
          {[...Array((parseInt(id) || 0) % 2 === 0 ? 4 : 3)].map((e, idx) => (
            <div key={idx} className="bg-base-content flex-1 overflow-hidden">
              <img
                className="flex-1 h-full object-cover group-hover:scale-[1.2] transition-transform"
                src={`https://picsum.photos/id/${idx + ""}/500/300`}
                alt="Image"
              />
            </div>
          ))}
        </div>
      </PostLinker>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex flex-wrap gap-2 text-sm font-light sm:text-base">
          <span className="">2d ago</span>
          <span className="font-black">&middot;</span>
          <span className="">Total 12 mins read</span>
          <span className="font-black">&middot;</span>
          <span className="">7 articles</span>
        </div>
        <PostLinker href={`/article/${id}`}>
          <h1 className="text-2xl font-black group-hover:underline sm:text-3xl">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          </h1>
        </PostLinker>
        <span className="text-base sm:text-lg">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque,
          commodi? Suscipit illum maxime, repellat inventore et distinctio
          porro.
        </span>

        <div className="flex flex-row items-center justify-end gap-2 sm:gap-4 mt-auto">
          <button
            className="btn-neutral btn-outline btn btn-sm btn-circle 
            bg-opacity-50 text-xl font-bold normal-case opacity-80
            group-hover:opacity-100 sm:btn-md sm:!text-3xl"
            title="Add to bookmark"
          >
            <MdPlaylistAdd />
          </button>
          <button
            className="btn-neutral btn-outline btn btn-sm btn-circle
            bg-opacity-50 text-xl font-bold normal-case opacity-80
            group-hover:opacity-100 sm:btn-md sm:!text-3xl"
            title="Add to bookmark"
          >
            <MdBookmarkAdd />
          </button>
          <PostLinker href={`/article/${id}`}>
            <button
              className="btn-neutral btn-outline btn btn-sm w-32
              bg-opacity-50 text-base font-bold normal-case opacity-80
              group-hover:opacity-100 sm:btn-md sm:!text-xl"
            >
              View
            </button>
          </PostLinker>
        </div>
      </div>
    </div>
  );
};

export default UserList;
