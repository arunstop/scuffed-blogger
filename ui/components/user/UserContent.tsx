import React, { useCallback, useState } from "react";
import { UserAboutTab } from "./UserAboutTab";
import { UserContentTabs } from "./UserContentTabs";
import { UserListTab } from "./UserListTab";
import { UserPostTab } from "./UserPostTab";

const RENDER_SECTIONS = (tab: string) => {
  console.log("active tab : " + tab);
  if (tab === "about") {  
    return <UserAboutTab id={"1"} />;
  } else if (tab === "lists") {
    return <UserListTab />;
  } else {
    return <UserPostTab id={"2"} />;
  }
};

const UserContent = ({initTab}:{initTab:string}) => {
  const [activeTab, setActiveTab] = useState<string>(initTab);
  const changeActiveTab = useCallback((title: string) => {
    setActiveTab(title);
  }, []);
  console.log("Render : UserContent");  
  // console.log(tab);

  // const currentPrettyPath = "/author/" + router.query.slug?.[0];
  // const currentPrettyPath = `/${router.pathname.split("/")[1]}/${
  //   router.query.slug?.[0]
  // }`;
  // console.log(currentPrettyPath);
  return (
    <div className="flex min-h-screen flex-col gap-4 sm:gap-8">
      <UserContentTabs
        activeTab={activeTab + ""}
        onClick={changeActiveTab}
        currentPath={""}
      />
      {RENDER_SECTIONS(activeTab)}
    </div>
  );
};

export default React.memo(UserContent);
