import React from "react";
import { CommentModelsWithPaging } from "../../../base/data/models/CommentModel";
import { useRoutedModalHook } from "../../../app/hooks/RoutedModalHook";
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
  const optionModal = useRoutedModalHook(optionParam);
  const replyModal = useRoutedModalHook(replyParam);
  const commentToReply = commentList.comments.find(
    (e) => e.id === replyModal.value,
  );
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
        parentComment={commentToReply}
      />
    </>
  );
}

export default React.memo(ArticleComments);
