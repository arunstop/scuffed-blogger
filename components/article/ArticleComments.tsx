import React from "react";
import ArticleComment from "./ArticleComment";

function ArticleComments() {
  return (
    <>
      {[...Array(10)].map((e, idx) => (
        <ArticleComment key={Math.random()} id={idx + ""} />
      ))}
    </>
  );
}

export default React.memo(ArticleComments);
