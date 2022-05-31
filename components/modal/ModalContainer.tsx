import React from "react";
import ArticleCommentModalReply from "../article/ArticleCommentModalReply";

const ModalContainer = React.memo(function ModalContainer() {
  return (
    <>
      <ArticleCommentModalReply />
    </>
  );
});

export default ModalContainer;
