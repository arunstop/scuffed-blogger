import React from "react";
import MainPost from "../main/MainPost";

function ArticleSectionSuggestions({ id }: { id: string }) {
  return (
    <>
      <span className="text-xl sm:text-2xl font-bold">More articles for you</span>
      {[...Array(10)].map((e) => (
        <MainPost key={Math.random()} post={{ id: id }} />
      ))}
    </>
  );
}

export default ArticleSectionSuggestions;
