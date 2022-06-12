import Link from "next/link";
import React from "react";
import { MdForum, MdStar, MdTrendingUp } from "react-icons/md";
import { MainTabItemProps } from "../main/MainTabItem";

export interface UserContentTabsProps {
  activeTab: string;
  onClick: (title: string) => void;
}

const tabs: MainTabItemProps[] = [
  {
    title: "Posts",
    icon: <MdStar className="text-xl sm:text-2xl" />,
    active: false,
  },
  {
    title: "Lists",
    icon: <MdTrendingUp className="text-xl sm:text-2xl" />,
    active: false,
  },
  {
    title: "About",
    icon: <MdForum className="text-xl sm:text-2xl" />,
    active: false,
  },
];

export const UserContentTabs = React.memo(function UserContentTabs({
  activeTab,
  onClick,
}: UserContentTabsProps) {
  console.log("Render: UserContentTabs");
  return (
    <div className="tabs tabs-boxed rounded-xl w-full">
      {tabs.map((e, idx) => {
        return (
          <Link key={idx} href={e.title.toLowerCase()} passHref>
            <a
              className={`tab tab-lg flex-1 sm:flex-none  text-lg sm:text-xl !rounded-xl font-bold transition-colors ${
                activeTab === e.title ? "tab-active" : ""
              }`}
              onClick={() => onClick(e.title)}
            >
              {e.title}
            </a>
          </Link>
        );
      })}
    </div>
  );
});
