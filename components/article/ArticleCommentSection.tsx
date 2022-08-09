import React, { useState } from "react";
import { Comment } from "../../utils/data/comment";
import { ArticleModel } from "../../utils/data/models/ArticleModel";
import InputTextArea from "../input/InputTextArea";
import ArticleComments from "./ArticleComments";

const egComments: Comment[] = [
  { id: 1, text: "" },
  { id: 2, text: "" },
  { id: 3, text: "" },
  { id: 4, text: "" },
  { id: 5, text: "" },
  { id: 6, text: "" },
];

function ArticleCommentSection({ article }: { article: ArticleModel }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>(egComments);

  // console.log("render ArticleCommentSection");
  return (
    <div className="flex flex-col gap-4 sm:gap-8">
      <div className="flex flex-row gap-4 items-start">
        <div className="avatar">
          <div
            className="w-10 rounded-lg border-[1px] border-base-content 
            group-hover:rounded-[50%] sm:w-12 sm:border-2 z-0 transition-all"
          >
            <img
              src={`https://api.lorem.space/image/face?hash=${article.id}`}
              alt={`User ${article.id}`}
            />
          </div>
        </div>
        <div className="form-control flex-1 rounded-xl gap-4">
          <InputTextArea
            value={comment}
            className="min-h-[12rem]"
            placeholder="Add a comment..."
            onChange={(ev) => setComment(ev.target.value)}
          />
          <div className="flex justify-end w-full gap-2 sm:gap-4">
            {comment.length !== 0 && (
              <button
                className="btn-outline btn ml-auto text-lg font-bold normal-case 
                opacity-80 hover:opacity-100 w-24 sm:w-36 border-2 sm:text-xl --btn-resp"
                onClick={() => {
                  setComment("");
                }}
              >
                Cancel
              </button>
            )}
            <button
              className={`flex-1 sm:flex-none font-bold btn btn-primary 
              normal-case text-xl sm:w-48 --btn-resp
              ${comment.length !== 0 ? "" : "btn-disabled"}`}
              onClick={() => {
                setComments([
                  ...comments,
                  { id: Math.floor(Math.random() * 30), text: comment },
                ]);
                setComment("");
              }}
            >
              Comment
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col-reverse gap-4 sm:gap-8">
        <ArticleComments comments={comments} />
      </div>
    </div>
  );
}

export default ArticleCommentSection;
