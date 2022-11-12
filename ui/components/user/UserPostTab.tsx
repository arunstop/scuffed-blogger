import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useAuthCtx } from "../../../app/contexts/auth/AuthHook";
import { waitFor } from "../../../app/helpers/DelayHelpers";
import { autoRetry } from "../../../app/helpers/MainHelpers";
import {
  ArticleListModelByUser,
  serviceArticleGetByUser,
} from "../../../app/services/ArticleService";
import {
  MainNetworkResponse,
  netEmpty,
  netError,
  netLoading,
} from "../../../base/data/Main";
import { toUserDisplay } from "../../../base/data/models/UserDisplayModel";
import { UserModel } from "../../../base/data/models/UserModel";
import Button from "../common/Button";
import LoadingIndicator from "../placeholder/LoadingIndicator";
import PostItem from "../post/PostItem";
import PostOptionModal from "../post/PostOptionModal";
import { InfiniteLoader } from "../utils/InfiniteLoader";

export const UserPostTab = React.memo(function UserPost({
  userProfile,
}: {
  userProfile?: UserModel;
}) {
  const router = useRouter();
  const [feed, setFeed] = useState<ArticleListModelByUser>();
  const offset = feed?.offset || 0;
  const [resp, setResp] = useState<MainNetworkResponse>();

  const { authStt } = useAuthCtx();

  const loadPosts = useCallback(async () => {
    // await waitFor(2000);
    // show loading indicator
    // setLoading(true);
    setResp(netLoading("Loading posts"));
    await waitFor(2000);

    if (!userProfile) return;
    const articleByUser = await autoRetry(
      async () =>
        await serviceArticleGetByUser({
          data: {
            articleListId: userProfile.list.posts,
            count: 5,
            start: offset,
          },
          callback: (resp) => {
            setResp(resp);
          },
        }),
    );

    // add delay if feed already loaded for ui purposes
    if (feed) await waitFor(200);
    if (!articleByUser) return setResp(netEmpty("No data"));
    setFeed((prev) => {
      if (prev)
        return {
          ...articleByUser,
          articles: [...prev.articles, ...articleByUser.articles],
        };
      return articleByUser;
    });
  }, [offset, userProfile]);

  useEffect(() => {
    if (!userProfile) return;
    loadPosts();
    setResp(netError("Error : testing error"));
    return () => {};
  }, [userProfile]);

  if (!userProfile) return <div>loading</div>;
  return (
    <>
      {!feed ? (
        <div className={`w-full`}>
          {(!resp || resp?.status === "loading") && (
            <div className="w-full flex flex-col gap-2 sm:gap-4 items-center text-center p-2 sm:p-4">
              <LoadingIndicator text="Loading articles" spinner />
            </div>
          )}
          {resp?.status === "error" && (
            <div className={`w-full`}>
              <div className="w-full flex flex-col gap-2 sm:gap-4 items-center text-center p-2 sm:p-4">
                <span className="sm:text-xl">
                  Whoops! Somethings is just not quite right...
                </span>
                <div className="flex gap-2 sm:gap-4">
                  <Button
                    className="btn --btn-resp btn-outline"
                    onClick={() => loadPosts()}
                  >
                    Try again
                  </Button>
                  <Button
                    className="btn --btn-resp btn-outline"
                    onClick={() => router.reload()}
                  >
                    Reload page
                  </Button>
                </div>
              </div>
            </div>
          )}
          {resp?.status === "empty" && (
            <>
              {authStt.user?.id === userProfile.id ? (
                <div className="w-full flex flex-col gap-2 sm:gap-4 items-center text-center p-2 sm:p-4">
                  <span className="sm:text-xl">
                    No articles found, write your first article and let the
                    world know!
                  </span>
                  <Link href={"/write"} passHref>
                    <a className="btn --btn-resp btn-outline">Write Article</a>
                  </Link>
                </div>
              ) : (
                <div className="w-full flex flex-col gap-2 sm:gap-4 items-center text-center p-2 sm:p-4">
                  <span className="sm:text-xl">
                    This user has not pulicize any articles yet.
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <>
          <InfiniteLoader
            className="flex flex-col gap-4 sm:gap-8"
            callback={(intersecting) => {
              if (intersecting) return loadPosts();
            }}
            loaderKey={feed.offset}
            loaderShown={
              resp?.status !== "error" &&
              feed.articles.length < feed.totalArticle
            }
            loaderClassName="animate-fadeIn"
            loaderChildren={<LoadingIndicator spinner />}
          >
            {feed.articles.map((e) => {
              return (
                <PostItem
                  key={e.id}
                  userDisplay={toUserDisplay(userProfile)}
                  article={e}
                />
              );
            })}
          </InfiniteLoader>
        </>
      )}
      <PostOptionModal />
    </>
  );
});
