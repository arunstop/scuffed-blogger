import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useMemo } from "react";
import { MdForum, MdStar, MdTrendingUp } from "react-icons/md";
import ArticleSectionAction from "../../components/article/ArticleActions";
import ArticleContent from "../../components/article/ArticleContent";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import MainPostStatusChip from "../../components/main/MainPostFilterChip";
import MainUserPopup from "../../components/main/MainPostUserPopup";
import MainSectionSkeleton from "../../components/main/MainSectionSkeleton";
import MainUserLabel from "../../components/main/MainUserLabel";
import { APP_NAME } from "../../utils/helpers/Constants";
import { scrollToTop } from "../../utils/hooks/RouteChangeHook";

function Article() {
  const router = useRouter();
  const { articleId } = router.query;

  useEffect(() => {
    scrollToTop();

    return () => {};
  }, [articleId]);

  const title = 'Lorem ipsum dolor sit amet consectetur adipisicing elit Laudantium itaque odit sed? Quibusdam quis nemo tempora';

  const mzPage = useMemo(() => {
    return (
      <>
        <Head>
          <title>
            {title + APP_NAME}
          </title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <meta
            name="description"
            content="Scuffed blogs, for scuffed people"
          />
        </Head>
        <Header />
        <div
          className="mx-auto flex min-h-screen max-w-[60rem] 
          flex-col justify-start gap-4 bg-base-100 p-4
          sm:gap-8 sm:p-8"
        >
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

          <ArticleContent id={articleId + ""} />

          <ArticleSectionAction id={articleId + ""} />

          <LazyArticleSectionComments id={articleId + ""} />

          <LazyArticleSectionSuggestions id={articleId + ""} />
        </div>
        <Footer />
      </>
    );
  }, [articleId]);

  console.log("render [articleId]");
  return <>{mzPage}</>;
}

const LazyArticleSectionComments = dynamic(
  () => import("../../components/article/ArticleCommentSection"),
  {
    loading: () => <MainSectionSkeleton text="Loading comments..." />,
    ssr: false,
  },
);

const LazyArticleSectionSuggestions = dynamic(
  () => import("../../components/article/ArticleSuggestionSection"),
  {
    loading: () => <MainSectionSkeleton text="Loading more posts..." />,
    ssr: false,
  },
);

export default Article;
