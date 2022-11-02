import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { MdForum, MdStar, MdTrendingUp } from "react-icons/md";
import { MainTabItemProps } from "../main/MainTabItem";

export interface UserContentTabsProps {
  activeTab: string;
  currentPath: string;
  onClick: (title: string) => void;
}

const tabs: MainTabItemProps[] = [
  {
    title: "posts",
    icon: <MdStar className="text-xl sm:text-2xl" />,
    active: false,
  },
  {
    title: "lists",
    icon: <MdTrendingUp className="text-xl sm:text-2xl" />,
    active: false,
  },
  {
    title: "about",
    icon: <MdForum className="text-xl sm:text-2xl" />,
    active: false,
  },
];

export const UserContentTabs = React.memo(function UserContentTabs({
  activeTab,
  onClick,
  currentPath,
}: UserContentTabsProps) {
  const router = useRouter();
  // active tab with
  let expectedActiveTab = "posts";
  if (tabs.map((e) => e.title).includes(activeTab)) {
    expectedActiveTab = activeTab;
  }
  const currentPrettyPath = `/${router.pathname.split("/")[1]}/${
    router.query.authorSlug?.[0]
  }`;
  // console.log(router);
  return (
    <div className="tabs tabs-boxed w-full rounded-xl">
      {tabs.map((e, idx) => {
        return (
          <Link
            key={idx}
            href={{
              pathname: currentPrettyPath+"/"+e.title,
            }}
            passHref
            shallow
          >
            <a
              key={idx}
              className={`tab tab-lg flex-1 sm:flex-none  text-lg sm:text-xl !rounded-xl font-bold transition-colors ${
                expectedActiveTab === e.title ? "tab-active" : ""
              }`}
              onClick={() => onClick(e.title)}
            >
              <span className="first-letter:uppercase">{e.title}</span>
            </a>
          </Link>
        );
      })}
    </div>
  );
});
