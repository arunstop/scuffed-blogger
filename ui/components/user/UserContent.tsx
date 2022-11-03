import React, { useCallback, useEffect, useState } from "react";
import { serviceUserGetById } from "../../../app/services/UserService";
import { UserDisplayModel } from "../../../base/data/models/UserDisplayModel";
import { UserModel } from "../../../base/data/models/UserModel";
import { UserAboutTab } from "./UserAboutTab";
import { UserContentTabs } from "./UserContentTabs";
import { UserListTab } from "./UserListTab";
import { UserPostTab } from "./UserPostTab";

const RENDER_SECTIONS = ({ user, tab }: { user?: UserModel; tab: string }) => {
  if (tab === "about") {
    return <UserAboutTab userProfile={user} />;
  } else if (tab === "lists") {
    return <UserListTab userProfile={user}/>;
  } else {
    return <UserPostTab userProfile={user}/>;
  }
};

const UserContent = (props: { userDisplay: UserDisplayModel; tab: string }) => {
  const { userDisplay, tab } = props;
  const [activeTab, setActiveTab] = useState<string>(tab);
  const changeActiveTab = useCallback((title: string) => {
    setActiveTab(title);
  }, []);

  const [userProfile, setUserProfile] = useState<UserModel>();

  const getUserProfile = useCallback(async (userId: string) => {
    const res = await serviceUserGetById({ data: { userId: userId } });
    if (!res) return;
    setUserProfile(res);
  }, []);

  useEffect(() => {
    getUserProfile(userDisplay.id);
    return () => {};
  }, []);

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
      {RENDER_SECTIONS({user:userProfile,tab:activeTab})}
    </div>
  );
};

export default React.memo(UserContent);
