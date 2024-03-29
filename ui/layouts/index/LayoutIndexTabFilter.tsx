import React, { useCallback, useState } from "react";
import { MdStar, MdTrendingUp, MdForum, MdNewReleases } from "react-icons/md";
import MainTabItem, { MainTabItemProps } from "../../components/main/MainTabItem";

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

function LayoutIndexTabFilter() {
  const [activeTab, setActiveTab] = useState<string>("Trending");
  const changeActiveTab = useCallback(
    (title:string) => {
      setActiveTab(title);
    },
    [],
  );

  return (
    <div
      className="tabs tabs-boxed rounded-xl w-full p-0 bg-transparent gap-2 sm:gap-4"
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

export default React.memo(LayoutIndexTabFilter);
