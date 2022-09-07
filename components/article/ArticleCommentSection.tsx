import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAuthCtx } from "../../utils/contexts/auth/AuthHook";
import {
  CommentModel,
  CommentModelsWithPaging,
} from "../../utils/data/models/CommentModel";
import {
  fbCommentAdd,
  fbCommentGet,
} from "../../utils/services/network/FirebaseApi/FirebaseCommentModules";
import InputTextArea from "../input/InputTextArea";
import ArticleComments from "./ArticleComments";

function ArticleCommentSection({ articleId }: { articleId: string }) {
  const {
    watch,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<{ comment: string }>({ mode: "onChange" });

  const comment = watch("comment") || "";

  const [commentList, setCommentList] = useState<CommentModelsWithPaging>();

  const {
    authStt: { user },
  } = useAuthCtx();

  const loadComments = async () => {
    const commentsFromDb = await fbCommentGet({
      data: { articleId, start: 0, count: 5 },
    });
    console.log("commentsFromDb",commentsFromDb);
    if (commentsFromDb) setCommentList(commentsFromDb);
  };

  const onComment: SubmitHandler<{ comment: string }> = async ({ comment }) => {
    console.log(comment);
    if (!user) return;
    const commentEntry: CommentModel = {
      id: nanoid(24),
      content: comment,
      dateAdded: Date.now(),
      dateUpdated: Date.now(),
      updated: false,
      articleId: articleId,
      userId: user.id,
      userName: user.name,
    };
    const res = await fbCommentAdd({ data: { comment: commentEntry } });
    if (res) loadComments();
  };

  useEffect(() => {
    loadComments();
  }, []);

  console.log("commentList", commentList);

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
              src={`https://api.lorem.space/image/face?hash=${articleId}`}
              alt={`User ${articleId}`}
            />
          </div>
        </div>
        <form
          className="form-control flex-1 rounded-xl gap-4"
          onSubmit={handleSubmit(onComment)}
        >
          <InputTextArea
            className="min-h-[12rem]"
            placeholder="Add a comment..."
            {...register("comment", {
              maxLength: {
                value: 100,
                message: "Comment requires maximum of 100 characters",
              },
              minLength: {
                value: 2,
                message: "Comment requires minimum of 2 characters",
              },
            })}
          />
          <div className="flex justify-end w-full gap-2 sm:gap-4">
            {!errors.comment && comment && (
              <button
                className="btn-outline btn ml-auto text-lg font-bold normal-case 
                opacity-80 hover:opacity-100 w-24 sm:w-36 border-2 sm:text-xl --btn-resp"
                onClick={() => {
                  reset();
                }}
              >
                Reset
              </button>
            )}
            <button
              className={`flex-1 sm:flex-none font-bold btn btn-primary 
              normal-case text-xl sm:w-48 --btn-resp
              ${!errors.comment && comment ? "" : "btn-disabled"}`}
              type="submit"
            >
              Comment
            </button>
          </div>
        </form>
      </div>
      {commentList && (
        <div className="flex flex-col-reverse gap-4 sm:gap-8">
          <ArticleComments commentList={commentList} />
        </div>
      )}
    </div>
  );
}

export default ArticleCommentSection;
