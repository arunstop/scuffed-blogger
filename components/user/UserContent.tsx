import React, { useCallback, useState } from "react";
import { UserAbout } from "./UserAbout";
import { UserContentTabs } from "./UserContentTabs";
import { UserPosts } from "./UserPosts";

const RENDER_SECTIONS = (title: string) => {
  if (title === "Posts") {
    return <UserPosts id={"2"} />;
  } else if(title==="Lists"){
    return "-";
  }
  else {
    return <UserAbout id={"1"}/>;
  }
};

const UserContent = () => {
  const [activeTab, setActiveTab] = useState<string>("Posts");
  const changeActiveTab = useCallback((title: string) => {
    setActiveTab(title);
  }, []);
  console.log("Render : UserContent");
  return (
    <div className="flex flex-col gap-4 sm:gap-8 min-h-screen">
      <UserContentTabs activeTab={activeTab + ""} onClick={changeActiveTab} />
      {RENDER_SECTIONS(activeTab)}
    </div>
  );
};

export default UserContent;
