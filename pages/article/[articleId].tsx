import Head from "next/head";
import { useRouter } from "next/router";
import React, {
  useMemo
} from "react";
import { MdForum, MdStar, MdTrendingUp } from "react-icons/md";
import ArticleSectionAction from "../../components/article/ArticleActions";
import ArticleContent from "../../components/article/ArticleContent";
import ArticleMoreContent from "../../components/article/ArticleMoreContent";
import MainContainer from "../../components/main/MainContainer";
import MainPostStatusChip from "../../components/main/MainPostFilterChip";
import MainUserPopup from "../../components/main/MainPostUserPopup";
import MainUserLabel from "../../components/main/MainUserLabel";
import { APP_NAME } from "../../utils/helpers/Constants";

function Article() {
  const router = useRouter();
  const { articleId } = router.query;
  
  // useEffect(() => {
  //   scrollToTop();

  //   return () => {};
  // }, [articleId]);

  const title =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit Laudantium itaque odit sed? Quibusdam quis nemo tempora";

  const mzPage = useMemo(() => {
    return (
      <>
        <Head>
          <title>{title + APP_NAME}</title>
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

          <ArticleContent id={articleId + ""} />

          <ArticleSectionAction id={articleId + ""} />

          {/* Comment and Suggestion section */}
          <ArticleMoreContent id={articleId + ""} />
        </MainContainer>
      </>
    );
  }, [articleId]);

  // console.log("render [articleId]");
  return <>{mzPage}</>;
}

export default Article;
