import React from "react";
import { usePostOptionModalBehaviorHook } from "../../utils/hooks/PostOptionModalBehaviorHook";
import PostItem from "../post/PostItem";
import PostOptionModal from "../post/PostOptionModal";

function ArticleSuggestionSection({ id }: { id: string }) {
  const { optionModal, closeOptionModal } = usePostOptionModalBehaviorHook();
  return (
    <>
      <span className="text-xl sm:text-2xl font-bold">
        More articles for you
      </span>
      {[...Array(10)].map((e, idx) => (
        <PostItem key={idx} post={{ id: idx + "" }} />
      ))}
      <PostOptionModal value={optionModal} onClose={closeOptionModal} />
    </>
  );
}

export default ArticleSuggestionSection;
