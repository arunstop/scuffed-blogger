import React from "react";
import {
  MdBookmarkAdd,
  MdOutlinePlaylistAdd,
  MdShare,
  MdThumbDown,
  MdThumbUp,
} from "react-icons/md";

function ArticleAction({ id }: { id: string }) {
  return (
    <div className="flex flex-wrap gap-4 sm:justify-end">
      <div className="inline-flex w-full gap-4 sm:w-auto">
        <button
          className="btn-outline btn btn-success flex-1 !border-[2px] sm:border-2 sm:w-32 sm:flex-none"
          title="Like"
        >
          <MdThumbUp className="text-2xl" />
        </button>
        <button
          className="btn-outline btn btn-error flex-1 !border-[2px] sm:border-2 sm:w-32 sm:flex-none"
          title="Dislike"
        >
          <MdThumbDown className="text-2xl" />
        </button>
      </div>
      {/* <button
        className="btn border-yellow-500 hover:border-yellow-600 w-full gap-2 text-xl 
        font-bold normal-case sm:w-48 bg-yellow-500 hover:bg-yellow-600 text-white"
      > */}
      <button
        className="btn btn-primary w-full 
        gap-2 text-xl font-bold normal-case sm:w-48"
      >
        <MdBookmarkAdd className="text-2xl" />
        Bookmark
      </button>
      <button
        className="btn btn-primary w-full 
        gap-2 text-xl font-bold normal-case sm:w-48"
      >
        <MdOutlinePlaylistAdd className="text-2xl" />
        Read Later
      </button>
      <button
        className="btn btn-primary w-full 
        gap-2 text-xl font-bold normal-case sm:w-48"
      >
        <MdShare className="text-2xl" />
        Share
      </button>
    </div>
  );
}

export default ArticleAction;
