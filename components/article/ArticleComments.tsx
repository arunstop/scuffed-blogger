import React from "react";
import { CommentModelsWithPaging } from "../../utils/data/models/CommentModel";
import { useArticleModalsBehaviorHook } from "../../utils/hooks/ArticleModalsBehaviorHook";
import ArticleCommentItem from "./ArticleCommentItem";
import ArticleCommentOptionModal from "./ArticleCommentOptionModal";
import ArticleCommentReplyModal from "./ArticleCommentReplyModal";

function ArticleComments({
  commentList,
}: // addComment,
{
  commentList: CommentModelsWithPaging;
  // addComment: (comments:Comment[]) => void;
}) {
  const { optionModal, closeOptionModal, replyModal, closeReplyModal } =
    useArticleModalsBehaviorHook();

  return (
    <>
      <div className="flex flex-col gap-4 sm:gap-8">
        {commentList.comments.map((e, idx) => (
          <ArticleCommentItem
            key={e.id}
            comment={e}
            // openOptionModal={openOptionModal}
            // openReplyModal={openReplyModal}
          />
        ))}
      </div>
      <ArticleCommentOptionModal
        value={optionModal !== null}
        onClose={closeOptionModal}
      />
      <ArticleCommentReplyModal
        value={replyModal !== null}
        onClose={closeReplyModal}
      />
    </>
  );
}

export default React.memo(ArticleComments);
