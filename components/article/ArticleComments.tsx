import React from "react";
import { CommentModelsWithPaging } from "../../base/data/models/CommentModel";
import { useModalRoutedBehaviorHook } from "../../app/hooks/ModalRoutedBehaviorHook";
import ArticleCommentItem from "./ArticleCommentItem";
import ArticleCommentOptionModal from "./ArticleCommentOptionModal";
import ArticleCommentReplyModal from "./ArticleCommentReplyModal";

const optionParam = "option";
const replyParam = "reply";
function ArticleComments({
  commentList,
  observe,
}: // addComment,
{
  commentList: CommentModelsWithPaging;
  observe?: boolean;
  // addComment: (comments:Comment[]) => void;
}) {
  const optionModal = useModalRoutedBehaviorHook(optionParam);
  const replyModal = useModalRoutedBehaviorHook(replyParam);

  return (
    <>
      <div className="flex flex-col gap-4 sm:gap-8">
        {commentList.comments.map((e, idx) => (
          <ArticleCommentItem
            key={e.id}
            comment={e}
            optionParam={optionParam}
            replyParam={replyParam}
            observe={observe}
          />
        ))}
      </div>
      <ArticleCommentOptionModal
        value={optionModal.show}
        onClose={() => optionModal.toggle(false)}
      />
      <ArticleCommentReplyModal
        value={replyModal.show}
        onClose={() => replyModal.toggle(false)}
      />
    </>
  );
}

export default React.memo(ArticleComments);
