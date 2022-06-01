import React from "react";
import ArticleCommentReplyModal from "../article/ArticleCommentReplyModal";

const ModalContainer = React.memo(function ModalContainer() {
  return (
    <>
      <ArticleCommentReplyModal />
    </>
  );
});

export default ModalContainer;
