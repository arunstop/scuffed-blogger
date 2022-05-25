import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import ArticleComments from "./ArticleComments";

function ArticleSectionComments({ id }: { id: string }) {
  const [comment, setComment] = useState("");

  console.log("render ArticleSectionComments");
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
            value={comment}
            onChange={(ev) => setComment(ev.target.value)}
          />
          <div className="flex justify-end w-full gap-4">
            {comment.length !== 0 && (
              <button
                className="btn btn-error btn-outline border-2 opacity-80"
                title="Reset"
                onClick={() => setComment("")}
              >
                <FaTimes className="text-2xl" />
              </button>
            )}
            <button
              className={`flex-1 sm:flex-none font-bold btn btn-primary 
              normal-case text-xl sm:w-48 ${comment.length !== 0 ? "" : "btn-disabled"}`}
            >
              Comment
            </button>
          </div>
        </div>
      </div>
      <ArticleComments />
    </div>
  );
}

export default ArticleSectionComments;
