import React, { useCallback, useState } from "react";
import { UserContentTabs } from "./UserContentTabs";
import { UserPosts } from "./UserPosts";

const RENDER_SECTIONS = (title: string) => {
  if (title === "Posts") {
    return <UserPosts id={"2"} />;
  } else {
    return "-";
  }
};

const UserContent = () => {
  const [activeTab, setActiveTab] = useState<string>("Posts");
  const changeActiveTab = useCallback((title: string) => {
    setActiveTab(title);
  }, []);
  console.log("Render : UserContent");
  return (
    <div className="flex flex-col gap-4 sm:gap-8">
      <UserContentTabs activeTab={activeTab + ""} onClick={changeActiveTab} />
      {RENDER_SECTIONS(activeTab)}
    </div>
  );
};

export default UserContent;
