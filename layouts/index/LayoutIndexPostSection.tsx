import { Transition } from "@headlessui/react";
import { FirebaseError } from "firebase/app";
import React, { useCallback, useEffect, useState } from "react";
import ErrorPlaceholder from "../../components/placeholder/ErrorPlaceholder";
import LoadingIndicator from "../../components/placeholder/LoadingIndicator";
import PostItem from "../../components/post/PostItem";
import PostOptionModal from "../../components/post/PostOptionModal";
import { MainNetworkResponse } from "../../utils/data/Main";
import {
  ArticleModelFromDb,
  fbArticleMirrorGetAll,
} from "../../utils/services/network/FirebaseApi/ArticleModules";

function LayoutIndexPostSection() {
  const [posts, setPosts] =
    useState<MainNetworkResponse<ArticleModelFromDb | null | FirebaseError>>();
  const [loading, setLoading] = useState(true);
  // const [status, setStatus] = useState<MainNetworkResponse>();
  const loadPosts = useCallback(async () => {
    // show loading indicator
    setLoading(true);
    await fbArticleMirrorGetAll({
      data: {
        count: 0,
        start: 0,
      },
      callback: (resp) => {
        if (resp.status === "loading") return;
        setPosts(resp);
        setLoading(false);
      },
    });
    // await waitFor(4000);
    // setStatus(false);
  }, []);

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
        {loading && <LoadingIndicator text="Loading posts..." spinner />}
        <Transition
          show={!loading && posts?.status === "error"}
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
            desc={posts?.message || ""}
            action={loadPosts}
            actionLabel="Try again"
          />
        </Transition>
        {!loading && posts?.status === "success" && (
          <>
            <div className="flex flex-col gap-4 sm:gap-8" id="main-content">
              {(posts.data as ArticleModelFromDb).articles.map((e) => {
                return <PostItem key={e.id} article={e} observe/>;
              })}
            </div>
            <PostOptionModal />
          </>
        )}
      </div>
    </>
  );
}

export default React.memo(LayoutIndexPostSection);
