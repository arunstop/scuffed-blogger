import React from "react";
import { LOREM } from "../../utils/helpers/Constants";
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
          <PostItem key={Math.random()} article={{
            id: idx+"",
            title: LOREM.slice(0, 120),
            desc: LOREM.slice(121, LOREM.length),
            content: encodeURIComponent(LOREM),
            thumbnail: `https://picsum.photos/id/${Math.floor(
              Math.random() * 10,
            )}/500/300`,
            author: "Munkrey Alf",
            dateAdded: Date.now(),
            dateUpdated: Date.now(),
            deleted: 0,
            duration: (LOREM.length || 0) / 200,
            tags: ["Technology", "Photography"],
          }} />
        ))}
      </div>
      <PostOptionModal />
    </>
  );
});
