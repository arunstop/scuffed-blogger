import React from "react";
import MainPost from "./MainPost";

function MainPostSection() {
  return (
    <div
      className="flex flex-col gap-4 sm:gap-8"
      id="main-content"
    >
      {[...Array(10)].map((e) => (
        <MainPost
          key={Math.random()}
          post={{ id: Math.round(Math.random() * 100) + "" }}
        />
      ))}
    </div>
  );
}

export default MainPostSection;
