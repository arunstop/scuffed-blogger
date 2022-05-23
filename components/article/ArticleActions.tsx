import React from "react";
import { MdThumbUp, MdThumbDown, MdShare, MdStar, MdOutlinePlaylistAdd } from "react-icons/md";

function ArticleAction({ id }: { id: string }) {
  return (
    <div className="flex flex-wrap sm:justify-end gap-4">
      <div className="inline-flex gap-4 w-full sm:w-auto">
        <button
          className="btn flex-1 sm:flex-none sm:w-32 btn-success btn-outline border-2"
          title="Like"
        >
          <MdThumbUp className="text-2xl" />
        </button>
        <button
          className="btn flex-1 sm:flex-none sm:w-32 btn-error btn-outline border-2"
          title="Dislike"
        >
          <MdThumbDown className="text-2xl" />
        </button>
      </div>
      <button
        className="btn btn-primary gap-2 
        font-bold normal-case text-xl w-full sm:w-48"
      >
        <MdStar className="text-2xl" />
        Favorite
      </button>
      <button
        className="btn btn-primary gap-2 
        font-bold normal-case text-xl w-full sm:w-48"
      >
        <MdOutlinePlaylistAdd className="text-2xl" />
        Read Later
      </button>
      <button
        className="btn btn-primary gap-2 
        font-bold normal-case text-xl w-full sm:w-48"
      >
        <MdShare className="text-2xl" />
        Share
      </button>
    </div>
  );
}

export default ArticleAction;
