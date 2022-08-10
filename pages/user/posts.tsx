import Head from "next/head";
import React, { useEffect, useState } from "react";
import MainContainer from "../../components/main/MainContainer";
import LoadingIndicator from "../../components/placeholder/LoadingIndicator";
import PostItemMini from "../../components/post/PostItemMini";
import { useAuthCtx } from "../../utils/contexts/auth/AuthHook";
import { ArticleModel } from "../../utils/data/models/ArticleModel";
import { APP_NAME } from "../../utils/helpers/Constants";
import { fbArticleGetByIds } from "../../utils/services/network/FirebaseApi/ArticleModules";

function PageUserPosts() {
  const {
    authStt: { user },
  } = useAuthCtx();

  const [articles, setArticles] = useState<ArticleModel[]>();
  const [loadingArticles, setLoadingArticles] = useState(true);

  const getArticles = async () => {
    if (!user) return;
    const articlesFromDb = await fbArticleGetByIds({
      articleIds: user?.list.posts,
    });
    setLoadingArticles(false);
    setArticles(articlesFromDb);
  };

  useEffect(() => {
    if(articles) return;
    getArticles();
  }, [articles]);

  return (
    <>
      <Head>
        <title>{`${user?.name} - ${APP_NAME}`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Scuffed blogs, for scuffed people" />
      </Head>
      <MainContainer>
        {/* title */}
        <div className="text-4xl font-bold sm:text-5xl">My Posts</div>
        {/* toolbar */}
        <div className="flex w-full min-h-[6rem] bg-primary/30"></div>
        {/* posts */}
        {loadingArticles && (
          <div className={`w-full`}>
            <LoadingIndicator text={`Loading articles...`} spinner />
          </div>
        )}
        {articles?.length && (
          <div className="flex flex-col gap-2 sm:gap-4 min-h-[24rem]">
            {articles.map((e, idx) => {
              return (
                <PostItemMini
                  key={idx}
                  article={e}
                />
              );
            })}
          </div>
        )}
        {/* pagination */}
        <div className="flex w-full min-h-[6rem] bg-primary/30"></div>
      </MainContainer>
    </>
  );
}

export default PageUserPosts;
