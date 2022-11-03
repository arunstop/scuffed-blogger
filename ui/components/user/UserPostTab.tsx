import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { useAuthCtx } from "../../../app/contexts/auth/AuthHook";
import { waitFor } from "../../../app/helpers/DelayHelpers";
import { autoRetry } from "../../../app/helpers/MainHelpers";
import {
  ArticleListModelByUser,
  serviceArticleGetByUser,
} from "../../../app/services/ArticleService";
import { MainNetworkResponse } from "../../../base/data/Main";
import { toUserDisplay } from "../../../base/data/models/UserDisplayModel";
import { UserModel } from "../../../base/data/models/UserModel";
import LoadingIndicator from "../placeholder/LoadingIndicator";
import PostItem from "../post/PostItem";
import PostOptionModal from "../post/PostOptionModal";
import IntersectionObserverTrigger from "../utils/IntesectionObserverTrigger";

export const UserPostTab = React.memo(function UserPost({
  userProfile,
}: {
  userProfile?: UserModel;
}) {
  const [feed, setFeed] = useState<ArticleListModelByUser>();
  const offset = feed?.offset || 0;
  const [resp, setResp] = useState<MainNetworkResponse>();

  const { authStt } = useAuthCtx();

  const loadPosts = useCallback(async () => {
    await waitFor(2000);
    // show loading indicator
    // setLoading(true);

    const articleByUser = await autoRetry(
      async () =>
        await serviceArticleGetByUser({
          articleListId: userProfile?.list.posts || "",
          keyword: "",
          paging: { start: offset, end: offset + 10 },
          callback: (resp) => {
            setResp(resp);
          },
        }),
    );

    // add delay if feed already loaded for ui purposes
    if (feed) await waitFor(200);
    if (!articleByUser) return;
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
    return () => {};
  }, [userProfile]);

  if (!userProfile) return <div>loading</div>;
  return (
    <>
      {!feed ? (
        <div className={`w-full`}>
          {resp && (
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
                    This user has no public articles.
                  </span>
                </div>
              )}
            </>
          )}
          {!resp && (
            <div className="w-full flex flex-col gap-2 sm:gap-4 items-center text-center p-2 sm:p-4">
              <LoadingIndicator text="Loading articles" spinner />
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 sm:gap-8">
            {feed.articles.map((e) => {
              return (
                <PostItem
                  key={e.id}
                  userDisplay={toUserDisplay(userProfile)}
                  article={e}
                />
              );
            })}
            {resp?.status !== "error" &&
              feed.articles.length < feed.totalArticle && (
                <IntersectionObserverTrigger
                  key={feed.offset}
                  callback={(intersecting) => {
                    if (intersecting) return loadPosts();
                  }}
                  className="animate-fadeIn"
                >
                  <LoadingIndicator spinner />
                </IntersectionObserverTrigger>
              )}
          </div>
        </>
      )}
      <PostOptionModal />
    </>
  );
});
