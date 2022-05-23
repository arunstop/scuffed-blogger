import React from "react";
import { MdClose } from "react-icons/md";

function ArticleComment({ id }: { id: string }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4 items-start">
        <div className="avatar">
          <div
            className="w-10 rounded-lg ring-1 ring-base-content 
            group-hover:rounded-[50%] sm:w-12 sm:ring-2 z-0 transition-all"
          >
            <img src={`https://api.lorem.space/image/face?hash=${id}`} />
          </div>
        </div>
        <div className="form-control flex-1 rounded-xl gap-4">
          <textarea
            className="textarea textarea-bordered rounded-xl h-24 text-base min-h-[12rem]"
            placeholder="Add a comment..."
          ></textarea>
          <div className="flex justify-end w-full gap-4">
            <button
              className="btn sm:w-32 btn-error btn-outline border-2"
              title="Reset"
            >
              <MdClose className="text-2xl" />
            </button>
            <button className="flex-1 sm:flex-none font-bold btn btn-primary normal-case text-xl sm:w-72">
              Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleComment;
