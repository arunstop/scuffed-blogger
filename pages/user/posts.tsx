import Head from "next/head";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import MainContainer from "../../components/main/MainContainer";
import ModalConfirmation from "../../components/modal/ModalConfirmation";
import LoadingIndicator from "../../components/placeholder/LoadingIndicator";
import PostItemMini from "../../components/post/PostItemMini";
import { useAuthCtx } from "../../utils/contexts/auth/AuthHook";
import { ArticleModel } from "../../utils/data/models/ArticleModel";
import { APP_NAME } from "../../utils/helpers/Constants";
import { useModalRoutedBehaviorHook } from "../../utils/hooks/ModalRoutedBehaviorHook";
import {
  fbArticleDelete,
  fbArticleGetByIds,
} from "../../utils/services/network/FirebaseApi/ArticleModules";

function PageUserPosts() {
  const {
    authStt: { user },
  } = useAuthCtx();

  const [articles, setArticles] = useState<ArticleModel[]>();
  const [loadingArticles, setLoadingArticles] = useState(true);
  // routed modal
  const modalDelete = useModalRoutedBehaviorHook("articleId");

  const getArticles = async () => {
    if (!user) return;
    const articlesFromDb = await fbArticleGetByIds({
      articleIds: user?.list.posts,
    });
    setLoadingArticles(false);
    setArticles(articlesFromDb);
  };

  useEffect(() => {
    if (articles) return;
    getArticles();
  }, [articles]);

  const deleteArticle = useCallback(async () => {
    await fbArticleDelete({ articleId: modalDelete.value }).then(async () => {
      getArticles();
    });
    modalDelete.close();
  }, [modalDelete.value]);

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
        {/* Loading indicator */}
        {loadingArticles && (
          <div className={`w-full`}>
            <LoadingIndicator text={`Loading articles...`} spinner />
          </div>
        )}
        {/* Empty indicator */}
        {!loadingArticles && !articles?.length && (
          <div className={`w-full`}>
            <div className="w-full flex flex-col gap-2 sm:gap-4 items-center text-center p-2 sm:p-4">
              <span className="sm:text-xl font-bold">
                No articles found, write your first article and let the world
                know!
              </span>
              <Link href={"/write"} passHref>
                <a className="btn --btn-resp btn-outline">Write Article</a>
              </Link>
            </div>
          </div>
        )}
        {/* The actual articles */}
        {articles?.length ? (
          <div className="flex flex-col gap-2 sm:gap-4 min-h-[24rem]">
            {articles.map((e, idx) => {
              return <PostItemMini key={idx} article={e} />;
            })}
          </div>
        ) : null}
        {/* pagination */}
        <div className="flex w-full min-h-[6rem] bg-primary/30"></div>
      </MainContainer>
      <ModalConfirmation
        value={modalDelete.show}
        title="Delete article"
        desc="Are you sure you want to delete this article? Please be careful. This action cannot be undone"
        onClose={modalDelete.close}
        onConfirm={deleteArticle}
      />
    </>
  );
}

export default React.memo(PageUserPosts);
