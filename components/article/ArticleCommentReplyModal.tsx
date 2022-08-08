import React, { useState } from "react";
import { ModalProps } from "../../utils/data/Main";
import ModalTemplate from "../modal/ModalTemplate";

const ArticleCommentReplyModal = React.memo(function ArticleCommentReplyModal({
  value,
  onClose,
}: ModalProps) {
  const [reply, setReply] = useState("");

  // const { uiStt, uiAct } = useUiCtx();
  function closeModal() {
    onClose();
    setReply("");
  }

  return (
    <ModalTemplate value={value} onClose={closeModal} title="Replying...">
      <div className="form-control flex-1 gap-4 rounded-xl sm:gap-8">
        <textarea
          className="textarea-bordered textarea max-h-[12rem] min-h-[12rem] sm:max-h-[24rem] sm:min-h-[18rem] rounded-xl text-base"
          placeholder="Add a reply..."
          value={reply}
          onChange={(ev) => setReply(ev.target.value)}
        />
        <div className="flex w-full justify-end gap-2 sm:gap-4">
          {reply.length !== 0 && (
            <button
              className="btn-outline btn --btn-resp ml-auto w-24 text-lg 
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
            onClick={closeModal}
          >
            Reply
          </button>
        </div>
      </div>
    </ModalTemplate>
  );
});

export default ArticleCommentReplyModal;
