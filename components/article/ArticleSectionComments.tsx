import React from "react";
import { FaTimes } from "react-icons/fa";
import ArticleComment from "./ArticleComment";

function ArticleSectionComments({ id }: { id: string }) {
  return (
    <div className="flex flex-col gap-4 sm:gap-8">
      <div className="flex flex-row gap-4 items-start">
        <div className="avatar">
          <div
            className="w-10 rounded-lg border-[1px] border-base-content 
            group-hover:rounded-[50%] sm:w-12 sm:border-2 z-0 transition-all"
          >
            <img
              src={`https://api.lorem.space/image/face?hash=${id}`}
              alt={`User ${id}`}
            />
          </div>
        </div>
        <div className="form-control flex-1 rounded-xl gap-4">
          <textarea
            className="textarea textarea-bordered rounded-xl h-24 text-base min-h-[12rem]"
            placeholder="Add a comment..."
          ></textarea>
          <div className="flex justify-end w-full gap-4">
          <button
              className="btn btn-error btn-outline border-2 opacity-80"
              title="Reset"
            >
              <FaTimes className="text-2xl" />
            </button>
            <button className="flex-1 sm:flex-none font-bold btn btn-primary normal-case text-xl sm:w-48">
              Comment
            </button>
          </div>
        </div>
      </div>
      {[...Array(10)].map((e) => (
        <ArticleComment key={Math.random()} id={id} />
      ))}
      
    </div>
  );
}

export default ArticleSectionComments;
