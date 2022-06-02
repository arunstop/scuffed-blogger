import React, { useCallback, useState } from "react";
import { Comment } from "../../utils/data/comment";
import ArticleComment from "./ArticleComment";
import ArticleCommentOptionModal from "./ArticleCommentOptionModal";
import ArticleCommentReplyModal from "./ArticleCommentReplyModal";

function ArticleComments({
  comments,
}: // addComment,
{
  comments: Comment[];
  // addComment: (comments:Comment[]) => void;
}) {
  const [optionModal, setOptionModal] = useState<string | number | null>(null);
  const [replyModal, setReplyModal] = useState<string | number | null>(null);

  const openOptionModal = useCallback((id: string | number | null) => {
    setOptionModal(id);
  }, []);

  const closeOptionModal = useCallback(() => {
    setOptionModal(null);
  }, []);

  const openReplyModal = useCallback((id: string | number | null) => {
    setReplyModal(id);
  }, []);

  const closeReplyModal = useCallback(() => {
    setReplyModal(null);
  }, []);

  console.log("render: Article Comments");
  return (
    <>
      {comments.map((e, idx) => (
        <ArticleComment
          key={idx}
          id={e.id}
          text={e.text}
          openOptionModal={openOptionModal}
          openReplyModal={openReplyModal}
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
