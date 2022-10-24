import React from "react";
import { useCommentCtx } from "../../../app/contexts/comment/CommentHook";
import { useRoutedModalHook } from "../../../app/hooks/RoutedModalHook";
import { CommentModelsWithPaging } from "../../../base/data/models/CommentModel";
import { isValidCommentQueryParam } from "../../helpers/RouteQueryValueHelpers";
import ArticleCommentItem from "./ArticleCommentItem";
import ArticleCommentOptionModal from "./ArticleCommentOptionModal";
import ArticleCommentReplyModal from "./ArticleCommentReplyModal";

const optionParam = "option";
const replyParam = "reply";
function ArticleComments({
  commentList,
  observe,
  lined,
  noModals,
}: // addComment,
{
  commentList: CommentModelsWithPaging;
  observe?: boolean;
  lined?: boolean;
  noModals?: boolean;
  // addComment: (comments:Comment[]) => void;
}) {
  const { state } = useCommentCtx();
  const optionModal = useRoutedModalHook(optionParam);
  const replyModal = useRoutedModalHook(replyParam);
  const commentToReply = () => {

    if (!replyModal.value) return undefined;
    const val = isValidCommentQueryParam(replyModal.value);

    if (!val) return undefined;
    // if the value is a parent comment it means it has no replyId

    if (!val.replyId) {
      return commentList.comments.find((e) => e.id === val.parentId);
    }
    if (!state.replies) return undefined;
    const parentComment = commentList.comments.find(
      (e) => e.id === val.parentId,
    );
    
    if (!parentComment) return undefined;
    const reply = state.replies
      .find((e) => e.parentCommentId === parentComment.id)
      ?.comments.find((e) => e.id === val.replyId);

    if (!reply) return undefined;
    return reply;
  };

  return (
    <>
      <div className="flex flex-col">
        {commentList.comments.map((e, idx) => (
          <ArticleCommentItem
            key={e.id}
            comment={e}
            optionParam={optionParam}
            replyParam={replyParam}
            observe={observe}
            isReply={lined}
          />
        ))}
      </div>
      {!noModals && (
        <>
          <ArticleCommentOptionModal
            value={optionModal.show}
            onClose={() => optionModal.toggle(false)}
            paramValue={optionModal.value || ""}
          />
          <ArticleCommentReplyModal
            value={replyModal.show}
            onClose={() => replyModal.toggle(false)}
            parentComment={commentToReply()}
          />
        </>
      )}
    </>
  );
}

export default React.memo(ArticleComments);
