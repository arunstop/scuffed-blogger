import { Transition } from "@headlessui/react";
import _ from "lodash";
import Head from "next/head";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdAdd, MdSearch } from "react-icons/md";
import InputText from "../../components/input/InputText";
import MainContainer from "../../components/main/MainContainer";
import MainLazyScrollTrigger from "../../components/main/MainLazyScrollTrigger";
import ModalConfirmation from "../../components/modal/ModalConfirmation";
import LoadingIndicator from "../../components/placeholder/LoadingIndicator";
import PostItemMini from "../../components/post/PostItemMini";
import { useAuthCtx } from "../../utils/contexts/auth/AuthHook";
import { APP_NAME } from "../../utils/helpers/Constants";
import { waitFor } from "../../utils/helpers/DelayHelpers";
import { transitionPullV } from "../../utils/helpers/UiTransitionHelpers";
import { useModalRoutedBehaviorHook } from "../../utils/hooks/ModalRoutedBehaviorHook";
import {
  ArticleListModelByUser,
  fbArticleDelete,
  fbArticleGetByUser,
} from "../../utils/services/network/FirebaseApi/ArticleModules";

function PageUserPosts() {
  const {
    authStt: { user },
    authAct,
  } = useAuthCtx();

  const [articleData, setArticleData] = useState<ArticleListModelByUser>();
  const [articleDataInit, setArticleDataInit] =
    useState<ArticleListModelByUser>();
  const [loadingArticles, setLoadingArticles] = useState(true);
  // const [keyword, setKeyword] = useState("");
  // routed modal
  const modalDelete = useModalRoutedBehaviorHook("articleId");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    getValues,
    // formState: { errors },
  } = useForm<{
    keyword: string;
  }>({ mode: "onChange" });

  const getArticles = async ({
    init,
    keyword,
    offset = 0,
    append,
  }: {
    init: boolean;
    keyword?: string;
    offset?: number;
    append?: boolean;
  }) => {
    // console.log("param", offset);
    // console.log("articleData", articleData?.offset);
    if (!user) return;
    const articleByUser = await fbArticleGetByUser({
      articleListId: user.list.posts,
      keyword: keyword || "",
      paging: { start: offset, end: offset + 2 },
    });
    if (!articleByUser) return setLoadingArticles(false);
    console.log("new", articleByUser.offset);
    setArticleData((prevArticleData) => {
      if (!prevArticleData) return articleByUser;
      if (append)
        return {
          ...articleByUser,
          articles: [
            ...(prevArticleData?.articles || []),
            ...articleByUser.articles,
          ],
        };
      return articleByUser;
    });
    if (init) setArticleDataInit(articleByUser);
    await waitFor(500);
    setLoadingArticles(false);
  };

  const deleteArticle = useCallback(async () => {
    if (!user) return;
    if (!articleData) return;
    const articleId = modalDelete.value;
    const articleTarget = articleData.articles.find((e) => e.id === articleId);

    if (articleTarget) {
      await fbArticleDelete({
        article: articleTarget,
        user: user,
      }).then(async (user) => {
        await getArticles({ init: true });
      });
    }
    modalDelete.close();
  }, [modalDelete.value]);

  const onSearch: SubmitHandler<{ keyword: string }> = ({ keyword }) => {
    search(keyword);
  };

  async function search(keyword: string) {
    // reset form
    if (!keyword) reset();
    const kw = keyword.trim().toLowerCase();
    const lastKw = articleData?.keyword.trim().toLowerCase();
    // do nothing if :
    // both last keyword and current keyword is empty
    if (!keyword && !lastKw) return;
    // or both keywords are equals
    if (keyword == lastKw) return;
    // if the last keyword is not empty and current keyword is empty
    // meaning user wants to reset the search
    // set the articleData to articleDataInit
    if (!keyword && lastKw) return setArticleData(articleDataInit);
    if (kw.length < 2) return;
    console.log("searching...");
    setLoadingArticles(true);
    getArticles({ init: false, keyword: kw });
  }

  const loadMoreArticles = () => {
    if (!articleData) return;
    if (articleData.offset > articleData.totalArticle)
      return console.log(articleData?.offset);
    setLoadingArticles(true);
    getArticles({
      init: false,
      keyword: articleData?.keyword,
      offset: articleData?.offset,
      append: true,
    });
    setLoadingArticles(false);
  };

  const articles = articleData?.articles || [];
  // getting articles at first render only
  useEffect(() => {
    if (articleDataInit) return;
    getArticles({
      init: true,
    });
  }, [articleDataInit]);

  return (
    <>
      <Head>
        <title>{`${_.startCase(user?.name)} - ${APP_NAME}`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Scuffed blogs, for scuffed people" />
      </Head>
      <MainContainer>
        {/* title */}
        <div className="text-4xl font-bold sm:text-5xl">My Posts </div>
        {/* toolbar */}
        {articleData && (
          <div className="tabs-boxed w-full rounded-xl min-h-[2rem] flex p-2 sm:p-4">
            <div className="flex justify-between w-full items-start">
              <form
                className="flex w-full sm:w-auto"
                onSubmit={handleSubmit(onSearch)}
              >
                <InputText
                  type="text"
                  placeholder="Search my posts..."
                  icon={<MdSearch />}
                  clearable={true}
                  clearAction={() => search("")}
                  clearIcon
                  {...register("keyword", {
                    minLength: {
                      value: 2,
                      message: "Keyword requires 2 characters",
                    },
                  })}
                />
              </form>
              <div className="hidden sm:block">
                <Link href={"/write"} passHref>
                  <a className="btn btn-primary --btn-resp">
                    Write new article
                  </a>
                </Link>
              </div>
              <div className="sm:hidden fixed z-[2] right-0 bottom-0 p-4 pointer-events-none [&>*]:pointer-events-auto">
                <Link href={"/write"} passHref>
                  <a className="btn btn-primary btn-circle">
                    <MdAdd className="text-2xl transition-colors" />
                  </a>
                </Link>
              </div>
            </div>
          </div>
        )}
        {!!articles.length && (
          <p className="sm:text-xl">
            <span className="font-bold">{articles.length || 0}</span> articles
            found.
          </p>
        )}
        {/* articles */}
        {articles.length ? (
          <div className="flex flex-col gap-2 sm:gap-4 min-h-[24rem]">
            {articles.map((e, idx) => {
              return <PostItemMini key={idx} article={e} />;
            })}
          </div>
        ) : null}

        {!loadingArticles && (
          <>
            {/* no articles */}
            {!articleData?.totalArticle && (
              <div className={`w-full`}>
                <div className="w-full flex flex-col gap-2 sm:gap-4 items-center text-center p-2 sm:p-4">
                  <span className="sm:text-xl">
                    No articles found, write your first article and let the
                    world know!
                  </span>
                  <Link href={"/write"} passHref>
                    <a className="btn --btn-resp btn-outline">Write Article</a>
                  </Link>
                </div>
              </div>
            )}
            {/* No result */}
            {!articles.length && (
              <div className={`w-full`}>
                <div className="w-full flex flex-col gap-2 sm:gap-4 items-center text-center p-2 sm:p-4">
                  <span className="sm:text-xl">
                    No articles found, with keyword{" "}
                    <span className="font-bold">`{articleData?.keyword}`</span>
                    <br />
                    Try to use a different keyword.
                  </span>

                  <button
                    className="btn --btn-resp btn-outline"
                    onClick={() => search("")}
                  >
                    Reset search
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        {loadingArticles ? (
          <Transition appear {...transitionPullV()}>
            <div className={`w-full h-[30rem]`}>
              <LoadingIndicator text={`Loading articles...`} spinner />
            </div>
          </Transition>
        ) : (
          articleData &&
          articleData.offset < articleData.totalArticle && (
            <MainLazyScrollTrigger
              key={articleData.offset + ""}
              callback={async () => {
                loadMoreArticles();
              }}
              className="flex w-full "
            >
            </MainLazyScrollTrigger>
          )
        )}

        {/* pagination */}
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

export default PageUserPosts;
