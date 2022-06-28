import React from "react";
import { ArticleModel } from "../../utils/data/models/ArticleModel";
import PostItem from "../post/PostItem";
import PostOptionModal from "../post/PostOptionModal";

function ArticleSuggestionSection({ article }: { article: ArticleModel }) {
  return (
    <>
      <span className="text-xl sm:text-2xl font-bold">
        More articles for you
      </span>
      {[...Array(10)].map((e, idx) => (
        <PostItem key={idx} post={{ id: idx + "" }} />
      ))}
      <PostOptionModal />
    </>
  );
}

export default ArticleSuggestionSection;
