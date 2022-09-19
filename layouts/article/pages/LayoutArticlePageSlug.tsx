import { formatDistance } from "date-fns";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MdForum, MdStar, MdTrendingUp } from "react-icons/md";
import ArticleSectionAction from "../../../components/article/ArticleActions";
import ArticleProgressBar from "../../../components/article/ArticleProgressBar";
import MainContainer from "../../../components/main/MainContainer";
import MainMarkdownContainer from "../../../components/main/MainMarkdownContainer";
import MainPostStatusChip from "../../../components/main/MainPostFilterChip";
import MainUserPopup from "../../../components/main/MainPostUserPopup";
import MobileHeader from "../../../components/main/MobileHeader";
import LoadingIndicator from "../../../components/placeholder/LoadingIndicator";
import UserHeader from "../../../components/user/UserHeader";
import { ArticleModel } from "../../../utils/data/models/ArticleModel";
import useLazyScrollerHook from "../../../utils/hooks/LazyScrollerHook";
import { fbArticleContentGet } from "../../../utils/services/network/FirebaseApi/ArticleModules";
import LayoutArticleMoreSection from "../LayoutArticleMoreSection";

function LayoutArticlePageSlug({
  articleContentless,
}: {
  articleContentless: ArticleModel;
}) {
  const router = useRouter();
  const articleId = articleContentless.id;

  const [article, setArticle] = useState(articleContentless);

  const getContent = async () => {
    const content = await fbArticleContentGet({ id: article.id });
    if (content) {
      setArticle((prev) => ({ ...prev, content: content }));
    }
  };
  const {
    load: loadContentSection,
    ref: contentSectionRef,
    setLoad: setLoadContentSection,
  } = useLazyScrollerHook({
    callback: () => {
      getContent();
    },
  });

  // reload article content on slug change
  useEffect(() => {
    setLoadContentSection(false);
  }, [articleId]);

  return (
    <>
      <ArticleProgressBar />
      <MobileHeader back={() => router.back()} title="Read Article" />
      <MainContainer>
        <div className="inline-flex justify-start">
          <div className="dropdown-hover dropdown">
            <UserHeader id={article.author} />

            <div tabIndex={0} className="dropdown-content pt-2">
              <MainUserPopup id={articleId + ""} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-base sm:text-lg">
          <span className="first-letter:uppercase">
            {`${formatDistance(article.dateAdded, Date.now())} ago`}
          </span>
          <span className="font-black">&middot;</span>
          <span className="">{`${Math.ceil(article.duration)} min${
            Math.ceil(article.duration) >= 2 ? "s" : ""
          } read`}</span>
          <span className="font-black">&middot;</span>
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
                `https://picsum.photos/id/${Math.floor(
                  Math.random() * 10,
                )}/500/300`
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
          <LoadingIndicator
            ref={contentSectionRef}
            spinner
            text="Loading content"
          />
        )}
      </MainContainer>
    </>
  );
}

export default LayoutArticlePageSlug;
