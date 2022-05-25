import React, { useCallback, useState } from "react";
import { MdStar, MdTrendingUp, MdForum, MdNewReleases } from "react-icons/md";
import MainTabItem, { MainTabItemProps } from "./MainTabItem";

const tabs: MainTabItemProps[] = [
  {
    title: "Favorites",
    icon: <MdStar className="text-xl sm:text-2xl" />,
    active: false,
  },
  {
    title: "Trending",
    icon: <MdTrendingUp className="text-xl sm:text-2xl" />,
    active: false,
  },
  {
    title: "Actively Discussing",
    icon: <MdForum className="text-xl sm:text-2xl" />,
    active: false,
  },
  {
    title: "Fresh",
    icon: <MdNewReleases className="text-xl sm:text-2xl" />,
    active: false,
  },
];

function MainSectionFilter() {
  const [activeTab, setActiveTab] = useState<string>("");
  const changeActiveTab = useCallback(
    (title:string) => {
      setActiveTab(title);
    },
    [],
  );

  return (
    <div
      className="tabs tabs-boxed items-stretch bg-base-300
      !rounded-xl shadow-xl ring-2 ring-base-content/20 p-0 overflow-hidden"
    >
      {tabs.map((e, idx) => (
        <MainTabItem
          key={idx}
          {...e}
          active={activeTab === e.title}
          onClick={changeActiveTab}
        />
      ))}
    </div>
  );
}

export default React.memo(MainSectionFilter);
