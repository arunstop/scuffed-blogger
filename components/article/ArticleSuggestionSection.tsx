import React from "react";
import PostItem from "../post/PostItem";
import PostOptionModal from "../post/PostOptionModal";

function ArticleSuggestionSection({ id }: { id: string }) {
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
