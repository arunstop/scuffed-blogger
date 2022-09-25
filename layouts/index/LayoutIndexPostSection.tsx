import { Transition } from "@headlessui/react";
import React, { useCallback, useEffect, useState } from "react";
import MainIntersectionObserverTrigger from "../../components/main/MainIntersectionObserverTrigger";
import ErrorPlaceholder from "../../components/placeholder/ErrorPlaceholder";
import LoadingIndicator from "../../components/placeholder/LoadingIndicator";
import PostItem from "../../components/post/PostItem";
import PostOptionModal from "../../components/post/PostOptionModal";
import { MainNetworkResponse } from "../../utils/data/Main";
import { waitFor } from "../../utils/helpers/DelayHelpers";
import {
  ArticleModelFromDb,
  fbArticleMirrorGetAll,
} from "../../utils/services/network/FirebaseApi/ArticleModules";

function LayoutIndexPostSection() {
  const [feed, setFeed] = useState<ArticleModelFromDb | null>(null);
  const [resp, setResp] = useState<MainNetworkResponse>();
  // const [loading, setLoading] = useState(true);
  // const [status, setStatus] = useState<MainNetworkResponse>();
  const loadPosts = useCallback(async () => {
    // show loading indicator
    // setLoading(true);
    const articlesFromDb = await fbArticleMirrorGetAll({
      data: {
        count: 2,
        start: feed?.offset || 0,
      },
      callback: (resp) => {
        // extracting the data so it won't duplicate
        setResp({ ...resp, data: null });
      },
    });
    // removing delay at initial load
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
    // await waitFor(4000);
    // setStatus(false);
  }, [feed]);

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <>
      {/* <LoadingPlaceholder
        title="Submitting article..."
        desc={"Adding your beautifully written article into our database. Please wait for a moment, this will be very quick"}
        action={loadPosts}
        actionLabel="Cancel"
      />
      <SuccessPlaceholder
        title="Article has been submitted!"
        desc={"Congratulation! We did it! Your beautifully written article has been added into our database for the world to read it!"}
        action={loadPosts}
        actionLabel="Go to the article"
      /> */}
      <div className="flex flex-col w-full gap-2 sm:gap-4 items-center min-h-screen">
        {/* when success */}
        {resp?.status === "loading" && !feed && (
          <LoadingIndicator text="Loading articles..." spinner />
        )}
        {!!feed && (
          <>
            <>
              <div
                className="flex flex-col gap-4 sm:gap-8 w-full"
                id="main-content"
              >
                {feed.articles.map((e) => {
                  return <PostItem key={e.id} article={e} observe />;
                })}
              </div>
              <PostOptionModal />
            </>

            {/* when loading */}
            {resp?.status !== "error" && feed.articles.length < feed.total && (
              <MainIntersectionObserverTrigger
              key={feed.offset}
                callback={(intersecting) => {
                  if (intersecting) return loadPosts();
                }}
                className="animate-fadeIn"
              >
                <LoadingIndicator spinner />
              </MainIntersectionObserverTrigger>
            )}
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
