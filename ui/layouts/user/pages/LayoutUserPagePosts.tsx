import { Transition } from "@headlessui/react";
import { useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdSearch } from "react-icons/md";
import { useAuthCtx } from "../../../../app/contexts/auth/AuthHook";
import { useUiCtx } from "../../../../app/contexts/ui/UiHook";
import { waitFor } from "../../../../app/helpers/DelayHelpers";
import { autoRetry } from "../../../../app/helpers/MainHelpers";
import { transitionPullV } from "../../../../app/helpers/UiTransitionHelpers";
import { routeHistoryAtom, scrollToTop } from "../../../../app/hooks/RouteChangeHook";
import { useRoutedModalHook } from "../../../../app/hooks/RoutedModalHook";
import {
  ArticleListModelByUser,
  serviceArticleDelete,
  serviceArticleGetByUser,
} from "../../../../app/services/ArticleService";
import { MainNetworkResponse, netLoading } from "../../../../base/data/Main";
import Container from "../../../components/common/Container";
import InputText from "../../../components/input/InputText";
import MobileHeader from "../../../components/main/MobileHeader";
import ModalConfirmation from "../../../components/modal/ModalConfirmation";
import LoadingIndicator from "../../../components/placeholder/LoadingIndicator";
import PostItemSearchResult from "../../../components/post/PostItemSearchResult";
import { InfiniteLoader } from "../../../components/utils/InfiniteLoader";

function LayoutUserPagePosts() {
  const {
    authStt: { user },
    authAct,
  } = useAuthCtx();

  const {
    action: { addToast, removeToast },
  } = useUiCtx();
  const router = useRouter();
  const [history] = useAtom(routeHistoryAtom);
  const [articleData, setArticleData] = useState<ArticleListModelByUser>();
  const [articleDataInit, setArticleDataInit] =
    useState<ArticleListModelByUser>();
  const [resp, setResp] = useState<MainNetworkResponse>();
  // const [keyword, setKeyword] = useState("");
  // routed modal
  const modalDelete = useRoutedModalHook("articleId");

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
    setResp(netLoading("Loading articles..."));
    const articleByUser = await autoRetry(
      async () =>
        await serviceArticleGetByUser({
          articleListId: user.list.posts,
          keyword: keyword || "",
          paging: { start: offset, end: offset + 5 },
          callback: async (res) => {
            if (res.status === "loading") return;
            setResp(res);
          },
        }),
    );
    if (!articleByUser) return;
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
  };

  const deleteArticle = useCallback(async () => {
    if (!user) return;
    if (!articleData) return;
    const articleId = modalDelete.value;
    const articleTarget = articleData.articles.find((e) => e.id === articleId);

    if (!articleTarget) return;
    const deleteArticle = await autoRetry(
      async () =>
        await serviceArticleDelete({
          article: articleTarget,
          user: user,
        }),
    );
    if (!deleteArticle) return;
    scrollToTop();
    await getArticles({ init: true });
    modalDelete.close();
    addToast({
      label: "Article successfully deleted",
      type: "success",
    });
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
    setResp(netLoading("Searching..."));
    getArticles({ init: false, keyword: kw });
  }

  const loadMoreArticles = async () => {
    if (!articleData) return;
    if (articleData.offset > articleData.totalArticle)
      return console.log("maxed out", articleData?.offset);
    setResp(netLoading("Searching..."));
    await waitFor(500);
    getArticles({
      init: false,
      keyword: articleData?.keyword,
      offset: articleData?.offset,
      append: true,
    });
  };

  const articles = articleData?.articles || [];
  const articleCount = articleData?.keyword
    ? articleData?.totalArticle || 0
    : articleDataInit?.totalArticle || 0;
  // getting articles at first render only
  useEffect(() => {
    if (articleDataInit) return;
    getArticles({
      init: true,
    });
  }, [articleDataInit]);
  return (
    <>
      <MobileHeader
        title={`My Posts`}
        back={() =>
          history.length
            ? router.replace(history[history.length - 1])
            : router.push("/")}
        actions={[
          {
            label: "Write",
            action() {
              router.push("/write");
            },
          },
        ]}
      />
      <Container>
        {/* title */}
        <div className="text-4xl font-bold sm:text-5xl hidden sm:block">
          My Posts
        </div>
        {/* toolbar */}
        {!!articleDataInit?.articles.length && (
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
              {/* <div className="sm:hidden fixed z-[2] right-0 bottom-0 p-2 pointer-events-none [&>*]:pointer-events-auto mb-[3rem]">
                <Link href={"/write"} passHref>
                  <a className="btn btn-primary btn-circle">
                    <MdAdd className="text-2xl transition-colors" />
                  </a>
                </Link>
              </div> */}
            </div>
          </div>
        )}
        {resp?.status === "loading" && !articleDataInit && (
          <LoadingIndicator text={`Loading articles`} spinner />
        )}
        {!!articles.length && (
          <p className="sm:text-xl">
            <span className="font-bold">{articleCount}</span>{" "}
            {`article${articleCount < 1 ? `s` : ``}`} found.
          </p>
        )}
        {/* articles */}
        {!!articles.length && (
          <InfiniteLoader
            className="flex flex-col gap-2 sm:gap-4"
            callback={async (intersecting) => {
              if (intersecting) return loadMoreArticles();
            }}
            loaderKey={articleData?.offset + ""}
            loaderShown={
              resp?.status !== "loading" &&
              !!articleData &&
              articleData.offset < articleData.totalArticle
            }
            loaderChildren={
              <Transition appear {...transitionPullV()}>
                <LoadingIndicator text={``} spinner />
              </Transition>
            }
          >
            {articles.map((e, idx) => {
              return (
                <div key={e.id} className="flex">
                  <PostItemSearchResult
                    article={e}
                    observe
                    withActions
                    className="w-full"
                  />
                </div>
              );
            })}
          </InfiniteLoader>
        )}

        {resp?.status !== "loading" && (
          <>
            {/* no articles */}
            {!articleDataInit?.totalArticle ? (
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
            ) : (
              articleDataInit?.totalArticle &&
              !articles.length && (
                <div className={`w-full`}>
                  <div className="w-full flex flex-col gap-2 sm:gap-4 items-center text-center p-2 sm:p-4">
                    <span className="sm:text-xl">
                      No articles found, with keyword{" "}
                      <span className="font-bold">
                        `{articleData?.keyword}`
                      </span>
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
              )
            )}
          </>
        )}

        {/* pagination */}
      </Container>
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

export default LayoutUserPagePosts;
