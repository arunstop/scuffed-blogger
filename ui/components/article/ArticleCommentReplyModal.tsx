import React, { useCallback, useState } from "react";
import { useAuthCtx } from "../../../app/contexts/auth/AuthHook";
import { useCommentCtx } from "../../../app/contexts/comment/CommentHook";
import { ModalProps } from "../../../base/data/Main";
import { CommentModel } from "../../../base/data/models/CommentModel";
import MobileHeader from "../main/MobileHeader";
import ModalTemplate from "../modal/ModalTemplate";
import ArticleCommentItem from "./ArticleCommentItem";

const ArticleCommentReplyModal = React.memo(function ArticleCommentReplyModal({
  value,
  onClose,
  parentComment,
}: ModalProps & { parentComment?: CommentModel }) {
  const {
    authStt: { user },
  } = useAuthCtx();

  const { action } = useCommentCtx();
  const [reply, setReply] = useState("");

  // const { uiStt, uiAct } = useUiCtx();
  function closeModal() {
    onClose();
    setReply("");
  }
  const submitReply = useCallback(
    async (content: string) => {
      if (!user || !parentComment) return;
      const newReply = await action.addReply({
        content: content,
        user: user,
        parentCommentId: parentComment.id,
      });
      if (newReply) closeModal();
    },
    [parentComment],
  );

  return (
    <ModalTemplate
      value={value}
      onClose={closeModal}
      title={`Replying to ${parentComment?.userName || "a comment"}`}
    >
      <MobileHeader
        title={`Replying to ${parentComment?.userName || "a comment"}`}
        back={() => closeModal()}
        toTop={() => {}}
      />
      {parentComment && (
        <div className="px-2 sm:px-4">
          <ArticleCommentItem comment={parentComment} noActions />
        </div>
      )}
      <div className="form-control flex-1 gap-4 rounded-xl sm:gap-8 p-2 sm:p-4">
        <textarea
          className="textarea-bordered textarea min-h-[9rem] rounded-xl text-base sm:max-h-[24rem] sm:min-h-[18rem]"
          placeholder="Add a reply..."
          value={reply}
          onChange={(ev) => setReply(ev.target.value)}
        />
        <div className="flex w-full justify-end gap-2 sm:gap-4">
          {reply.length !== 0 && (
            <button
              className="--btn-resp btn-outline btn ml-auto w-24 text-lg 
                        font-bold normal-case opacity-80 hover:opacity-100 sm:w-36 sm:text-xl"
              onClick={() => {
                setReply("");
              }}
              tabIndex={-1}
            >
              Cancel
            </button>
          )}
          <button
            className={`flex-1 sm:flex-none font-bold btn btn-primary 
            normal-case text-xl sm:w-48 transition --btn-resp
            ${reply.length !== 0 ? "" : "btn-disabled"}`}
            onClick={() => submitReply(reply)}
          >
            Reply
          </button>
        </div>
      </div>
    </ModalTemplate>
  );
});

export default ArticleCommentReplyModal;
