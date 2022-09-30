import LayoutArticleSuggestionSection from "./LayoutArticleSuggestionSection";
import LayoutArticleCommentSection from "./comment/LayoutArticleCommentSection";
import { ArticleModel } from "../../base/data/models/ArticleModel";
import useLazyScrollerHook from "../../app/hooks/LazyScrollerHook";
import LoadingIndicator from "../../components/placeholder/LoadingIndicator";

// Supposed to serve as container of comment and suggestion section
function LayoutArticleMoreSection({ article }: { article: ArticleModel }) {
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

  return (
    <>
      {loadCommentSection ? (
        <LayoutArticleCommentSection articleId={article.id} />
      ) : (
        <LoadingIndicator ref={commentSectionRef} spinner text="Loading comments..." />
      )}

      {loadSuggestionSection ? (
        <LayoutArticleSuggestionSection article={article} />
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

export default LayoutArticleMoreSection;
