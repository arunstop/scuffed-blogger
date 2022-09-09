import { formatDistance } from "date-fns";
import { GetServerSideProps } from "next";
import Head from "next/head";
import React, { useEffect, useMemo, useState } from "react";
import { MdForum, MdStar, MdTrendingUp } from "react-icons/md";
import ArticleSectionAction from "../../components/article/ArticleActions";
import LayoutArticleMoreSection from "../../layouts/article/LayoutArticleMoreSection";
import MainContainer from "../../components/main/MainContainer";
import MainMarkdownContainer from "../../components/main/MainMarkdownContainer";
import MainPostStatusChip from "../../components/main/MainPostFilterChip";
import MainUserPopup from "../../components/main/MainPostUserPopup";
import MainUserLabel from "../../components/main/MainUserLabel";
import LoadingIndicator from "../../components/placeholder/LoadingIndicator";
import { ArticleModel } from "../../utils/data/models/ArticleModel";
import { APP_NAME } from "../../utils/helpers/Constants";
import useLazyScrollerHook from "../../utils/hooks/LazyScrollerHook";
import { fbArticleContentGet } from "../../utils/services/network/FirebaseApi/ArticleModules";
import { mainApi } from "../../utils/services/network/MainApi";

export const getServerSideProps: GetServerSideProps<{
  articleContentless: ArticleModel;
}> = async (context) => {
  // SLUG ORDER
  // 0 = User's id
  // 1 = Tab/section

  // Getting id from the slug from the last 24 chars
  const slug = (context.query.articleId || "") as string;
  const id = slug.slice(-24);
  const articleContentless = await mainApi.mainArticleGetById({ id: id });
  // Show 404 if article not found or
  // if the slugs don't  match
  if (!articleContentless || articleContentless.slug !== slug)
    return {
      notFound: true,
    };
  return { props: { articleContentless: articleContentless } };
};

function Article({ articleContentless }: { articleContentless: ArticleModel }) {
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

  const mzPage = useMemo(() => {
    return (
      <>
        <Head>
          <title>{`${article.title} - ${APP_NAME}`}</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <meta
            name="description"
            content="Scuffed blogs, for scuffed people"
          />
        </Head>
        <MainContainer>
          <div className="inline-flex justify-start">
            <div className="dropdown-hover dropdown self-start">
              <MainUserLabel id={articleId + ""} />

              <div tabIndex={0} className="dropdown-content pt-2">
                <MainUserPopup id={articleId + ""} />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-base sm:text-lg">
            <span className="">{`${formatDistance(article.dateAdded, Date.now())} ago`}
              
            </span>
            <span className="font-black">&middot;</span>
            <span className="">{`${Math.floor(article.duration)} mins read`}</span>
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

          <h1 className="text-3xl font-black sm:text-4xl">
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

          {loadContentSection ? (
            <>
              <MainMarkdownContainer
                content={decodeURIComponent(
                  article?.content || "Article's Content",
                )}
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
  }, [article]);

  // console.log("render [articleId]");
  return <>{mzPage}</>;
}

export default React.memo(Article);
