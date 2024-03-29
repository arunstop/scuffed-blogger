import React from "react";
import { ArticleModel } from "../../../base/data/models/ArticleModel";
import PostItem from "../../components/post/PostItem";
import PostOptionModal from "../../components/post/PostOptionModal";

function LayoutArticleSuggestionSection({ article }: { article: ArticleModel }) {
  return (
    <>
      <span className="text-xl sm:text-2xl font-bold animate-fadeIn">
        More articles for you
      </span>
      {[...Array(10)].map((e, idx) => (
        <PostItem key={idx} article={article} />
      ))}
      <PostOptionModal />
    </>
  );
}

export default LayoutArticleSuggestionSection;
