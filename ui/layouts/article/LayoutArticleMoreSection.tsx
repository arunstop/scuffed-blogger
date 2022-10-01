import { useState } from "react";
import { ArticleModel } from "../../../base/data/models/ArticleModel";
import IntersectionObserverTrigger from "../../components/utils/IntesectionObserverTrigger";
import LoadingIndicator from "../../components/placeholder/LoadingIndicator";
import LayoutArticleCommentSection from "./comment/LayoutArticleCommentSection";
import LayoutArticleSuggestionSection from "./LayoutArticleSuggestionSection";

// Supposed to serve as container of comment and suggestion section
function LayoutArticleMoreSection({ article }: { article: ArticleModel }) {
  const [commentSection, setCommentSection] = useState(false);
  const [suggestionSection, setSuggestionSection] = useState(false);
  return (
    <>
      {commentSection ? (
        <LayoutArticleCommentSection articleId={article.id} />
      ) : (
        <IntersectionObserverTrigger
          callback={(intersecting) => {
            if (intersecting) return setCommentSection(intersecting);
          }}
        >
          <LoadingIndicator spinner text="Loading comments..." />
        </IntersectionObserverTrigger>
      )}

      {suggestionSection ? (
        <LayoutArticleSuggestionSection article={article} />
      ) : (
        <IntersectionObserverTrigger
          callback={(intersecting) => {
            if (intersecting) return setSuggestionSection(intersecting);
          }}
        >
          <LoadingIndicator spinner text="Loading related articles..." />
        </IntersectionObserverTrigger>
      )}
    </>
  );
}

// const LazyArticleCommentSection = dynamic(
//   () => import("../../ui/components/article/ArticleCommentSection"),
//   {
//     loading: () => <MainSectionSkeleton text="Loading comments..." />,
//     ssr: false,
//   },
// );

// const LazyArticleSuggestionSection = dynamic(
//   () => import("../../ui/components/article/ArticleSuggestionSection"),
//   {
//     loading: () => <MainSectionSkeleton text="Loading more posts..." />,
//     ssr: false,
//   },
// );

export default LayoutArticleMoreSection;
