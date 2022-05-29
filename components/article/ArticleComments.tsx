import React from "react";
import { Comment } from "../../utils/data/comment";
import ArticleComment from "./ArticleComment";

function ArticleComments({
  comments,
}: // addComment,
{
  comments: Comment[];
  // addComment: (comments:Comment[]) => void;
}) {
  console.log("render: Article Comments");
  return (
    <>
      {comments.map((e, idx) => (
        <ArticleComment key={Math.random()} id={e.id} text={e.text} />
      ))}
    </>
  );
}

export default React.memo(ArticleComments);
