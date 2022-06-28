import React, { useEffect } from "react";
import ArticleCommentSection from "../../components/article/ArticleCommentSection";
import ArticleSuggestionSection from "../../components/article/ArticleSuggestionSection";
import { ArticleModel } from "../../utils/data/models/ArticleModel";
import useLazyScrollerHook from "../../utils/hooks/LazyScrollerHook";
import LoadingIndicator from "../placeholder/LoadingIndicator";

// Supposed to serve as container of comment and suggestion section
function ArticleMoreContent({ article }: { article: ArticleModel }) {
  const {
    load: loadCommentSection,
    setLoad: setLoadCommentSection,
    ref: commentSectionRef,
  } = useLazyScrollerHook({delay:1000});
  const {
    load: loadSuggestionSection,
    setLoad: setLoadSuggestionSection,
    ref: suggestionSectionRef,
  } = useLazyScrollerHook({delay:1000});

  //   refresh when id change
  useEffect(() => {
    setLoadCommentSection(false);
    setLoadSuggestionSection(false);

    return () => {};
  }, [article]);

  return (
    <>
      {loadCommentSection ? (
        <ArticleCommentSection article={article} />
      ) : (
        <LoadingIndicator ref={commentSectionRef} spinner text="Loading comments..." />
      )}

      {loadSuggestionSection ? (
        <ArticleSuggestionSection article={article} />
      ) : (
        <LoadingIndicator ref={suggestionSectionRef} spinner text="Loading related articles..." />
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
