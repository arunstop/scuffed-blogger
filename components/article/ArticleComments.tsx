import React, { useCallback, useState } from "react";
import { Comment } from "../../utils/data/comment";
import ArticleComment from "./ArticleComment";
import ArticleCommentOptionModal from "./ArticleCommentOptionModal";

function ArticleComments({
  comments,
}: // addComment,
{
  comments: Comment[];
  // addComment: (comments:Comment[]) => void;
}) {
  const [optionModal, setOptionModal] = useState<string | number | null>(null);
  const openOptionModal = useCallback((id: string) => {
    setOptionModal(id);
  }, []);

  const closeOptionModal = useCallback(() => {
    setOptionModal(null);
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
        />
      ))}
      <ArticleCommentOptionModal
        value={optionModal !== null}
        onClose={closeOptionModal}
      />
    </>
  );
}

export default React.memo(ArticleComments);
