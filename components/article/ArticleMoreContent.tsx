import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import useLazyScrollerHook from "../../utils/hooks/LazyScrollerHook";
import MainSectionSkeleton from "../main/MainSectionSkeleton";

// Supposed to serve as container of comment and suggestion section
function ArticleMoreContent({ id }: { id: string }) {
  const {
    load: loadCommentSection,
    setLoad: setLoadCommentSection,
    ref: commentSectionRef,
  } = useLazyScrollerHook();
  const {
    load: loadSuggestionSection,
    setLoad: setLoadSuggestionSection,
    ref: SuggestionSectionRef,
  } = useLazyScrollerHook();

  //   refresh when id change
  useEffect(() => {
    setLoadCommentSection(false);
    setLoadSuggestionSection(false);

    return () => {};
  }, [id]);

  return (
    <>
      {loadCommentSection ? (
        <LazyArticleCommentSection id={id} />
      ) : (
        <div ref={commentSectionRef}>Loading Comments...</div>
      )}

      {loadSuggestionSection ? (
        <LazyArticleSuggestionSection id={id} />
      ) : (
        <div ref={SuggestionSectionRef}>Loading Related Articles...</div>
      )}
    </>
  );
}

const LazyArticleCommentSection = dynamic(
  () => import("../../components/article/ArticleCommentSection"),
  {
    loading: () => <MainSectionSkeleton text="Loading comments..." />,
    ssr: false,
  },
);

const LazyArticleSuggestionSection = dynamic(
  () => import("../../components/article/ArticleSuggestionSection"),
  {
    loading: () => <MainSectionSkeleton text="Loading more posts..." />,
    ssr: false,
  },
);

export default ArticleMoreContent;
