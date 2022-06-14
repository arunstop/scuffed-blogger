import React, { useEffect } from "react";
import ArticleCommentSection from "../../components/article/ArticleCommentSection";
import ArticleSuggestionSection from "../../components/article/ArticleSuggestionSection";
import useLazyScrollerHook from "../../utils/hooks/LazyScrollerHook";
import MainSectionSkeleton from "../main/MainSectionSkeleton";

// Supposed to serve as container of comment and suggestion section
function ArticleMoreContent({ id }: { id: string }) {
  const {
    load: loadCommentSection,
    setLoad: setLoadCommentSection,
    ref: commentSectionRef,
  } = useLazyScrollerHook({delay:250});
  const {
    load: loadSuggestionSection,
    setLoad: setLoadSuggestionSection,
    ref: suggestionSectionRef,
  } = useLazyScrollerHook({delay:500});

  //   refresh when id change
  useEffect(() => {
    setLoadCommentSection(false);
    setLoadSuggestionSection(false);

    return () => {};
  }, [id]);

  return (
    <>
      {loadCommentSection ? (
        <ArticleCommentSection id={id} />
      ) : (
        <MainSectionSkeleton ref={commentSectionRef} text="Loading comments..." />
      )}

      {loadSuggestionSection ? (
        <ArticleSuggestionSection id={id} />
      ) : (
        <MainSectionSkeleton ref={suggestionSectionRef} text="Loading related suggestions..." />
      )}
    </>
  );
}

// const LazyArticleCommentSection = dynamic(
//   () => import("../../components/article/ArticleCommentSection"),
//   {
//     loading: () => <MainSectionSkeleton text="Loading comments..." />,
//     ssr: false,
//   },
// );

// const LazyArticleSuggestionSection = dynamic(
//   () => import("../../components/article/ArticleSuggestionSection"),
//   {
//     loading: () => <MainSectionSkeleton text="Loading more posts..." />,
//     ssr: false,
//   },
// );

export default ArticleMoreContent;
