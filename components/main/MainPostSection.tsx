import React from "react";
import PostItem from "../post/PostItem";
import PostOptionModal from "../post/PostOptionModal";

function MainPostSection() {

  return (
    <>
      <div className="flex flex-col gap-4 sm:gap-8" id="main-content">
        {[...Array(10)].map((e,idx) => (
          <PostItem
            key={idx}
            post={{ id: Math.round(idx * 100) + "" }}
          />
        ))}
      </div>
      <PostOptionModal/>
    </>
  );
}

export default React.memo(MainPostSection);
