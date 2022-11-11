import React, { useCallback, useState } from "react";
import { useAuthCtx } from "../../../app/contexts/auth/AuthHook";
import { useCommentCtx } from "../../../app/contexts/comment/CommentHook";
import { waitFor } from "../../../app/helpers/DelayHelpers";
import { ModalProps } from "../../../base/data/Main";
import { CommentModel } from "../../../base/data/models/CommentModel";
import Button from "../common/Button";
import MobileHeader from "../main/MobileHeader";
import ModalTemplate from "../modal/ModalTemplate";
import Memoized from "../utils/Memoized";
import ArticleCommentItem from "./ArticleCommentItem";

const ArticleCommentReplyModal = React.memo(function ArticleCommentReplyModal({
  value,
  onClose,
  parentComment,
}: ModalProps & { parentComment?: CommentModel }) {
  return (
    <ModalTemplate
      value={value}
      onClose={onClose}
      title={`Replying to ${parentComment?.userName || "a comment"}`}
    >
      <Memoized show once>
        <Content show={value} onClose={onClose} parentComment={parentComment} />
      </Memoized>
    </ModalTemplate>
  );
});

function Content({
  show,
  parentComment,
  onClose,
}: {
  show: boolean;
  parentComment?: CommentModel;
  onClose: () => void;
}) {
  const {
    authStt: { user },
  } = useAuthCtx();

  const { action } = useCommentCtx();
  const [reply, setReply] = useState("");

  function closeModal() {
    onClose();
    setReply("");
  }
  const submitReply = useCallback(
    async (content: string) => {
      if (!user || !parentComment) return;
      // console.log(parentComment);
      const newReply = await action.addReply({
        content: content,
        user: user,
        parentCommentId: parentComment.parentCommentId ?? parentComment.id,
      });
      if (!newReply) return;
      closeModal();
      await waitFor(500);
      // scroll into view
      const el = document.getElementById(`comment-${newReply.id}`);
      el?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "center",
      });
    },
    [parentComment],
  );
  return (
    <>
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
              className="--btn-resp btn-outline btn ml-auto w-24 text-lg font-bold normal-case opacity-80 
              hover:opacity-100 sm:w-36 sm:text-xl"
              onClick={() => {
                setReply("");
              }}
              tabIndex={-1}
            >
              Cancel
            </button>
          )}
          <Button
            className={`flex-1 sm:flex-none font-bold btn btn-primary 
            normal-case text-xl sm:w-48 transition --btn-resp
            ${reply.length !== 0 ? "" : "btn-disabled"}`}
            onClick={() => submitReply(reply)}
            loadingOnClick
          >
            Reply
          </Button>
        </div>
      </div>
    </>
  );
}

export default ArticleCommentReplyModal;
