import { GetServerSideProps } from "next";
import Head from "next/head";
import React, { useMemo } from "react";
import { MdForum, MdStar, MdTrendingUp } from "react-icons/md";
import ArticleSectionAction from "../../components/article/ArticleActions";
import ArticleContent from "../../components/article/ArticleContent";
import ArticleMoreContent from "../../components/article/ArticleMoreContent";
import MainContainer from "../../components/main/MainContainer";
import MainPostStatusChip from "../../components/main/MainPostFilterChip";
import MainUserPopup from "../../components/main/MainPostUserPopup";
import MainUserLabel from "../../components/main/MainUserLabel";
import { ArticleModel } from "../../utils/data/models/ArticleModel";
import { APP_NAME } from "../../utils/helpers/Constants";
import { mainApi } from "../../utils/services/network/MainApi";

export const getServerSideProps: GetServerSideProps<{
  article: ArticleModel;
}> = async (context) => {
  // SLUG ORDER
  // 0 = User's id
  // 1 = Tab/section

  const slug = (context.query.articleId || "") as string;

  const article = await mainApi.mainArticleGetById({ id: slug });
 
  if (!article)
    return {
      notFound: !article,
    };
  return { props: { article: article } };
};

function Article({ article }: { article: ArticleModel }) {
  // const router = useRouter();
  // const { articleId } = router.query;
  const articleId = article.id;

  // useEffect(() => {
  //   scrollToTop();

  //   return () => {};
  // }, [articleId]);

  // const title =
  //   "Lorem ipsum dolor sit amet consectetur adipisicing elit Laudantium itaque odit sed? Quibusdam quis nemo tempora";

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
            <span className="">2d ago</span>
            <span className="font-black">&middot;</span>
            <span className="">2mins read</span>
            <span className="font-black">&middot;</span>
            <span className="">Technology</span>
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

          <ArticleContent article={article} />

          <ArticleSectionAction article={article} />

          {/* Comment and Suggestion section */}
          <ArticleMoreContent article={article} />
        </MainContainer>
      </>
    );
  }, [article]);

  // console.log("render [articleId]");
  return <>{mzPage}</>;
}

export default React.memo(Article);
