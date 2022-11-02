import React, { useCallback, useEffect, useState } from "react";
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

  const loadPosts = useCallback(async () => {
    // show loading indicator
    // setLoading(true);

    const articleByUser = await autoRetry(
      async () =>
        await serviceArticleGetByUser({
          articleListId: userProfile?.list.posts||"",
          keyword: "",
          paging: { start: offset, end: offset + 2 },
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
  }, [offset,userProfile]);

  useEffect(() => {
    console.log("userProfile",userProfile);
    if(!userProfile) return;
    loadPosts();
    return () => {};
  }, [userProfile]);

  if (!userProfile) return <div>loading</div>;
  return (
    <>
      {!!feed && (
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
            {resp?.status !== "error" && feed.articles.length < feed.totalArticle && (
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
