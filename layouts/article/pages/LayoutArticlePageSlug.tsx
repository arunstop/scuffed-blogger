import { formatDistance } from "date-fns";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import {
  MdForum,
  MdMoreVert,
  MdRefresh,
  MdStar,
  MdTrendingUp,
} from "react-icons/md";
import ArticleSectionAction from "../../../components/article/ArticleActions";
import ArticleProgressBar from "../../../components/article/ArticleProgressBar";
import MainContainer from "../../../components/main/MainContainer";
import MainIntersectionObserverTrigger from "../../../components/main/MainIntersectionObserverTrigger";
import MainMarkdownContainer from "../../../components/main/MainMarkdownContainer";
import MainPostStatusChip from "../../../components/main/MainPostFilterChip";
import MainUserPopup from "../../../components/main/MainPostUserPopup";
import MobileHeader from "../../../components/main/MobileHeader";
import LoadingIndicator from "../../../components/placeholder/LoadingIndicator";
import UserHeader from "../../../components/user/UserHeader";
import { ArticleModel } from "../../../base/data/models/ArticleModel";
import {
  fbArticleContentGet,
  fbArticleUpdateView,
} from "../../../app/services/ArticleService";
import LayoutArticleMoreSection from "../LayoutArticleMoreSection";

function LayoutArticlePageSlug({
  articleContentless,
}: {
  articleContentless: ArticleModel;
}) {
  const router = useRouter();
  const articleId = articleContentless.id;

  const [article, setArticle] = useState(articleContentless);

  const getContent = useCallback(async () => {
    const content = await fbArticleContentGet({ id: article.id });
    if (content) {
      setArticle((prev) => ({ ...prev, content: content }));
      await fbArticleUpdateView({
        data: { id: article.id },
      });
    }
  }, []);

  // reload article content on slug change
  useEffect(() => {
    // removing article content

    setArticle((prev) => ({ ...prev, content: "" }));
  }, [articleId]);

  return (
    <>
      <ArticleProgressBar />
      <MobileHeader
        back={() => router.back()}
        title="Read Article"
        actions={[
          {
            label: "Reload",
            icon: <MdRefresh />,
            action() {
              router.reload();
            },
          },
          {
            label: "Options",
            icon: <MdMoreVert />,
            action() {
              alert("should show more options");
            },
          },
        ]}
      />
      <MainContainer>
        <div className="inline-flex justify-start">
          <div className="dropdown-hover dropdown">
            <UserHeader id={article.author} />

            <div tabIndex={0} className="dropdown-content pt-2">
              <MainUserPopup id={articleId + ""} />
            </div>
          </div>
        </div>

        <div className="block text-base sm:text-lg [&>.separator]:mx-[0.5rem]">
          <span className="first-letter:uppercase">
            {`${formatDistance(article.dateAdded, Date.now())} ago`}
          </span>
          <span className="separator font-black">&middot;</span>
          <span className="">{`${Math.ceil(article.duration)} min${
            Math.ceil(article.duration) >= 2 ? "s" : ""
          } read`}</span>
          <span className="separator font-black">&middot;</span>
          <span className="">{`${article.topics?.join(", ")}`}</span>
        </div>

        <div className=" flex flex-wrap justify-start gap-2 overflow-hidden">
          <MainPostStatusChip
            icon={<MdStar className="text-xl sm:text-2xl" />}
            title="299 Favorited"
            color="bg-yellow-500"
          />
          <MainPostStatusChip
            icon={<MdTrendingUp className="text-xl sm:text-2xl" />}
            title="Trending"
            color="bg-red-500"
          />
          <MainPostStatusChip
            icon={<MdForum className="text-xl sm:text-2xl" />}
            title="Actively Discussing"
            color="bg-blue-500"
          />
        </div>

        <h1 id="article-title" className="text-3xl font-black sm:text-4xl">
          {article?.title || `Article's Title`}
        </h1>
        <h2 className="text-xl font-semibold sm:text-2xl">
          {article?.desc || `Article's Description`}
        </h2>
        <div className="flex flex-col gap-2 sm:gap-4">
          <figure className="relative aspect-video w-full overflow-hidden rounded-xl">
            <img
              className="h-full w-full max-w-none object-cover transition-transform group-hover:scale-[1.2] bg-primary"
              src={
                article?.thumbnail ||
                `https://picsum.photos/id/${article.dateAdded
                  .toString()
                  .substring(0, -2)}/500/300`
              }
              alt="Image"
              width={240}
              height={240}
            />
          </figure>
        </div>

        {article.content ? (
          <>
            <MainMarkdownContainer
              content={decodeURIComponent(article?.content)}
            />
            <ArticleSectionAction article={article} />
            <LayoutArticleMoreSection article={article} />
          </>
        ) : (
          <MainIntersectionObserverTrigger
            callback={(intersecting) => {
              if (intersecting) {
                return getContent();
              }
            }}
          >
            <LoadingIndicator spinner text="Loading content" />
          </MainIntersectionObserverTrigger>
        )}
      </MainContainer>
    </>
  );
}

export default LayoutArticlePageSlug;
