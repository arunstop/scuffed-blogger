import { nanoid } from "nanoid";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuthCtx } from "../../../../app/contexts/auth/AuthHook";
import { userAvatarLinkGet } from "../../../../app/helpers/MainHelpers";
import { fbCommentAdd } from "../../../../app/services/CommentService";
import { CommentModel } from "../../../../base/data/models/CommentModel";
import InputTextArea from "../../../components/input/InputTextArea";
import UserAvatar from "../../../components/user/UserAvatar";

function LayoutArticleCommentForm({
  articleId,
  loadComments,
}: {
  articleId: string;
  loadComments: () => void;
}) {
  const {
    authStt: { user },
  } = useAuthCtx();

  const {
    watch,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<{ comment: string }>({ mode: "onChange" });
  const comment = watch("comment") || "";

  const onComment: SubmitHandler<{ comment: string }> = async ({ comment }) => {
    console.log(comment);
    if (!user) return;
    const dateNow = Date.now();
    const commentEntry: CommentModel = {
      id: `${dateNow}-${nanoid(24)}`,
      content: comment,
      dateAdded: dateNow,
      dateUpdated: dateNow,
      updated: false,
      articleId: articleId,
      userId: user.id,
      userName: user.name,
      upvote: [user.id],
      downvote: [],
    };
    const res = await fbCommentAdd({ data: { comment: commentEntry } });
    if (res) {
      loadComments();
      reset();
    }
  };
  const userAvatar = userAvatarLinkGet(user?.id||"");

  return (
    <div className="flex flex-row gap-4 items-start animate-fadeIn">
      <UserAvatar src={userAvatar} />
      <form
        className="form-control flex-1 rounded-xl gap-4"
        onSubmit={handleSubmit(onComment)}
      >
        <InputTextArea
          id="article-comment-input"
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
              className="btn-outline btn ml-auto text-lg font-bold normal-case opacity-80 hover:opacity-100 w-24 sm:w-36 border-2 sm:text-xl --btn-resp"
              onClick={() => {
                reset();
              }}
            >
              Reset
            </button>
          )}
          <button
            className={`flex-1 sm:flex-none font-bold btn btn-primary normal-case text-xl sm:w-48 --btn-resp
            ${!errors.comment && comment ? "" : "btn-disabled"}`}
            type="submit"
          >
            Comment
          </button>
        </div>
      </form>
    </div>
  );
}

export default React.memo(LayoutArticleCommentForm);
