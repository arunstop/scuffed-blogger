import React, { useCallback, useState } from "react";
import { UserAboutTab } from "./UserAboutTab";
import { UserContentTabs } from "./UserContentTabs";
import { UserListTab } from "./UserListTab";
import { UserPostTab } from "./UserPostTab";

const RENDER_SECTIONS = (title: string) => {
  if (title === "Posts") {
    return <UserPostTab id={"2"} />;
  } else if(title==="Lists"){
    return <UserListTab/>;
  }
  else {
    return <UserAboutTab id={"1"}/>;
  }
};

const UserContent = () => {
  const [activeTab, setActiveTab] = useState<string>("Posts");
  const changeActiveTab = useCallback((title: string) => {
    setActiveTab(title);
  }, []);
  console.log("Render : UserContent");
  return (
    <div className="flex min-h-screen flex-col gap-4 sm:gap-8">
      <UserContentTabs activeTab={activeTab + ""} onClick={changeActiveTab} />
      {RENDER_SECTIONS(activeTab)}
    </div>
  );
};

export default UserContent;
