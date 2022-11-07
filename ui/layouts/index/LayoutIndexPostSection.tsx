import { Transition } from "@headlessui/react";
import React, { useCallback, useEffect, useState } from "react";
import {
  UserDisplayProvider,
  useUserDisplayActions,
  useUserDisplayStates,
} from "../../../app/contexts/userDisplay/UserDisplayContext";

import { waitFor } from "../../../app/helpers/DelayHelpers";
import { autoRetry } from "../../../app/helpers/MainHelpers";
import {
  ArticleModelFromDb,
  serviceArticleMirrorGetAll,
} from "../../../app/services/ArticleService";
import { MainNetworkResponse } from "../../../base/data/Main";
import ErrorPlaceholder from "../../components/placeholder/ErrorPlaceholder";
import LoadingIndicator from "../../components/placeholder/LoadingIndicator";
import PostItem from "../../components/post/PostItem";
import PostOptionModal from "../../components/post/PostOptionModal";
import { InfiniteLoader } from "../../components/utils/InfiniteLoader";

function LayoutIndexPostSection() {
  return (
    <UserDisplayProvider>
      <Child />
    </UserDisplayProvider>
  );
}

function Child() {
  const [feed, setFeed] = useState<ArticleModelFromDb | null>(null);
  const [resp, setResp] = useState<MainNetworkResponse>();
  // const [loading, setLoading] = useState(true);
  // const [status, setStatus] = useState<MainNetworkResponse>();
  const actions = useUserDisplayActions();
  const displays = useUserDisplayStates((e) => e["displays"]);

  const loadPosts = useCallback(async () => {
    // show loading indicator
    // setLoading(true);
    const articlesFromDb = await autoRetry(async (attempt, max) => {
      // console.log("calling");
      const res = await serviceArticleMirrorGetAll({
        data: {
          count: 5,
          start: feed?.offset || 0,
        },
        callback: (resp) => {
          // extracting the data so it won't duplicate
          setResp({ ...resp, data: null });
        },
      });
      return res;
    });

    // add delay if feed already loaded for ui purposes
    if (feed) await waitFor(200);
    if (!articlesFromDb) return;
    setFeed((prev) => {
      if (prev)
        return {
          ...articlesFromDb,
          articles: [...prev.articles, ...articlesFromDb.articles],
        };
      return articlesFromDb;
    });
    // unique user list
    const userIds = [...new Set(articlesFromDb.articles.map((e) => e.author))];
    userIds.forEach((e) => {
      actions.addUserDisplay(e);
    });
    // await waitFor(4000);
    // setStatus(false);
  }, [feed]);

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <>
      <div className="flex flex-col w-full gap-2 sm:gap-4 items-center min-h-screen">
        {/* when success */}
        {resp?.status === "loading" && !feed && (
          <LoadingIndicator text="Loading articles..." spinner />
        )}
        {!!feed && (
          <>
            <InfiniteLoader
              className="flex flex-col gap-4 sm:gap-8 w-full"
              callback={(intersecting) => {
                if (intersecting) return loadPosts();
              }}
              loaderShown={
                resp?.status !== "error" &&
                feed.articles.length < feed.total
              }
              loaderKey={feed?.offset + ""}
              loaderClassName="animate-fadeIn"
              loaderChildren={<LoadingIndicator spinner />}
            >
              {feed.articles.map((e) => {
                return (
                  <PostItem
                    key={e.id}
                    article={e}
                    userDisplay={displays.find((dd) => dd.id === e.author)}
                    observe
                  />
                );
              })}
            </InfiniteLoader>
            <PostOptionModal />
          </>
        )}
        {/* when error */}
        <Transition
          show={resp?.status === "error"}
          as={"div"}
          className="w-full"
          enter="ease-out transition-all absolute inset-x-0 duration-300"
          enterFrom="opacity-0 translate-y-[20%] scale-x-0"
          enterTo="opacity-100 translate-y-0 scale-x-100"
          entered="transform-none"
          leave="ease-in transition-all absolute inset-x-0 duration-300"
          leaveFrom="opacity-100 translate-y-0 scale-x-100"
          leaveTo="opacity-0 translate-y-[20%] scale-x-0"
        >
          <ErrorPlaceholder
            title="Oops something is wrong..."
            desc={resp?.message || ""}
            action={loadPosts}
            actionLabel="Try again"
          />
        </Transition>
      </div>
    </>
  );
}

export default React.memo(LayoutIndexPostSection);
