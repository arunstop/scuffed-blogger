import React from "react";
import PostItem from "../post/PostItem";
import PostOptionModal from "../post/PostOptionModal";

export const UserPostTab = React.memo(function UserPost({
  id,
}: {
  id: string;
}) {
  console.log("Render : UserPosts");
  return (
    <>
      <div className="flex flex-col gap-4 sm:gap-8">
        {[...Array(10)].map((_e, idx) => (
          <PostItem key={Math.random()} post={{ id: idx + "" }} />
        ))}
      </div>
      <PostOptionModal />
    </>
  );
});
