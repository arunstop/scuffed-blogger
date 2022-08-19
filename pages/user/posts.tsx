import Head from "next/head";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import InputText from "../../components/input/InputText";
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
  fbArticleGetByUser
} from "../../utils/services/network/FirebaseApi/ArticleModules";

function PageUserPosts() {
  const {
    authStt: { user },
    authAct,
  } = useAuthCtx();

  const [articles, setArticles] = useState<ArticleModel[]>();
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [keyword, setKeyword] = useState("");
  // routed modal
  const modalDelete = useModalRoutedBehaviorHook("articleId");

  const getArticles = async () => {
    if (!user) return;
    const articlesFromDb = await fbArticleGetByUser({
      articleListId: user.list.posts,
    });
    setLoadingArticles(false);
    setArticles(articlesFromDb?.articles || []);
  };

  useEffect(() => {
    if (articles) return;
    getArticles();
  }, [articles]);

  const deleteArticle = useCallback(async () => {
    if (!user) return;
    if (!articles) return;
    const articleId = modalDelete.value;
    const articleTarget = articles.find((e) => e.id === articleId);

    if (articleTarget) {
      await fbArticleDelete({
        article: articleTarget,
        user: user,
      }).then(async (user) => {
        await getArticles();
      });
    }
    modalDelete.close();
  }, [modalDelete.value]);

  const searchArticles = useCallback(async (keyword: string) => {
    setKeyword(keyword);
  }, []);

  const searchedArticles = !articles
    ? []
    : keyword.trim().length < 2
    ? articles
    : articles.filter((e) => {
        const title = e.title.toLowerCase().trim();
        const desc = e.desc.toLowerCase().trim();
        const topics = e.topics?.join(" ").toLowerCase().trim() || "";
        const tags = e.tags.join(" ").toLowerCase().trim();
        // const date = format(e.dateAdded, "EEEE, DDDD MMMM yyyy")
        //   .toLowerCase()
        //   .trim();
        const kw = keyword.toLowerCase().trim();
        return (
          title.includes(kw) ||
          desc.includes(kw) ||
          topics.includes(kw) ||
          tags.includes(kw)
        );
      });

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
        <div className="tabs-boxed w-full rounded-xl min-h-[2rem] flex p-2 sm:p-4">
          <div className="flex justify-between w-full items-center">
            <p className="sm:text-xl">
              <span className="font-bold">{searchedArticles?.length || 0}</span>{" "}
              articles found.
            </p>

            <div className="flex ">
              <InputText
                icon={<MdSearch />}
                placeholder="Search my posts..."
                value={keyword}
                clearable={keyword.length >= 2}
                clearAction={()=>searchArticles("")}
                clearIcon
                onChange={(e) => searchArticles(e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* posts */}
        {/* Loading indicator */}
        {loadingArticles && (
          <div className={`w-full`}>
            <LoadingIndicator text={`Loading articles...`} spinner />
          </div>
        )}
        {/* Empty indicator */}
        {!loadingArticles && !searchedArticles?.length && (
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
        {searchedArticles?.length ? (
          <div className="flex flex-col gap-2 sm:gap-4 min-h-[24rem]">
            {searchedArticles.map((e, idx) => {
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
