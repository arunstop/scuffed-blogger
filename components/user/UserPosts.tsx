import React from "react";
import MainPost from "../main/MainPost";

export const UserPosts = React.memo(function UserPost({id}:{id:string}) {
    console.log("Render : UserPosts");
    return (
    <>
      {[...Array(10)].map((_e, idx) => (
        <MainPost key={Math.random()} post={{ id: idx + "" }} />
      ))}
    </>
  );
});
