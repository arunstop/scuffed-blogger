import { Transition } from "@headlessui/react";
import React, { useCallback, useEffect, useState } from "react";
import { Api } from "../../utils/services/api/Api";
import { MainNetworkResponse } from "../../utils/data/Main";
import ErrorPlaceholder from "../placeholder/ErrorPlaceholder";
import LoadingIndicator from "../placeholder/LoadingIndicator";
import PostItem from "../post/PostItem";
import PostOptionModal from "../post/PostOptionModal";

function MainPostSection() {
  const [posts, setPosts] = useState<MainNetworkResponse>();
  const [loading, setLoading] = useState(true);
  // const [status, setStatus] = useState<MainNetworkResponse>();
  const loadPosts = useCallback(async () => {
    // show loading indicator
    setLoading(true);
    await Api.getArticleById({
      callback: (resp) => {
        // Cancel the process `status` = loading
        if (resp.status === "loading") return;
        // Proceed if `status` = error/success
        setLoading(false);
        setPosts({
          ...resp,
          data:
            resp.status === "success"
              ? Math.floor(Math.random() * 10) + 10
              : resp.data,
        });
      },
    });
    // await waitFor(4000);
    // setStatus(false);
  }, []);

  useEffect(() => {
    loadPosts();
    return () => {};
  }, [loadPosts]);

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
              {[...Array(posts.data)].map((e, idx) => (
                <PostItem key={idx} post={{ id: Math.round(idx * 100) + "" }} />
              ))}
            </div>
            <PostOptionModal />
          </>
        )}
      </div>
    </>
  );
}

export default React.memo(MainPostSection);
