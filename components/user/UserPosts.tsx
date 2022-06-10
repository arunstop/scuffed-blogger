import React from "react";
import PostItem from "../post/PostItem";

export const UserPosts = React.memo(function UserPost({id}:{id:string}) {
    console.log("Render : UserPosts");
    return (
    <>
      {[...Array(10)].map((_e, idx) => (
        <PostItem key={Math.random()} post={{ id: idx + "" }} />
      ))}
    </>
  );
});
