import React from "react";
import { Comment } from "../../utils/data/comment";
import { useArticleModalsBehaviorHook } from "../../utils/hooks/ArticleModalsBehaviorHook";
import ArticleComment from "./ArticleComment";
import ArticleCommentOptionModal from "./ArticleCommentOptionModal";
import ArticleCommentReplyModal from "./ArticleCommentReplyModal";

export type ArticleModals = "REPLY" | "OPTIONS";



function ArticleComments({
  comments,
}: // addComment,
{
  comments: Comment[];
  // addComment: (comments:Comment[]) => void;
}) {
  const { optionModal, closeOptionModal, replyModal, closeReplyModal } =
    useArticleModalsBehaviorHook();

  return (
    <>
      {comments.map((e, idx) => (
        <ArticleComment
          key={idx}
          id={e.id}
          text={e.text}
          // openOptionModal={openOptionModal}
          // openReplyModal={openReplyModal}
        />
      ))}
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
