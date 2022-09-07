import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { MdHome, MdNotifications, MdPerson, MdSearch } from "react-icons/md";
import { routeTrimQuery } from "../../utils/helpers/MainHelpers";
import { useUiSidebarBehaviorHook } from "../../utils/hooks/UiSidebarBehaviorHook";

interface BottomBarTabProps {
  title: string;
  icon: ReactNode;
  active: boolean;
  action?: () => void;
}

function BottomBar() {
  const router = useRouter();
  const currentPath = routeTrimQuery(router.asPath);
  const { sidebar, openSidebar, closeSidebar } = useUiSidebarBehaviorHook();
  const isSearching = !!router.query.search;
  const [modalShown, setModalShown] = useState(isSearching);

  const tabs: BottomBarTabProps[] = [
    {
      title: "Home",
      icon: <MdHome />,
      active: router.pathname === "/",
      action: () => {
        if (router.pathname !== "/") return router.back();
        return router.push("/");
      },
    },
    {
      title: "Search",
      icon: <MdSearch />,
      active: isSearching,
      action: () => {
        router.push(
          { pathname: currentPath, query: { search: true } },
          undefined,
          { shallow: true },
        );
      },
    },
    {
      title: "Notifications",
      icon: <MdNotifications />,
      active: !!router.query.notifications,
      action: () => {
        router.push(
          { pathname: currentPath, query: { notifications: true } },
          undefined,
          { shallow: true },
        );
      },
    },
    {
      title: "Me",
      icon: <MdPerson />,
      active: sidebar,
      action: () => {
        openSidebar();
      },
    },
  ];

  useEffect(() => {
    // if(!isSearching) return;
    // set modal shown based on searchModal and sidebar
    setModalShown(isSearching);
  }, [isSearching]);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 sm:hidden ${
        `z-20`
      }`}
    >
      <div className="h-[3rem] bg-primary flex w-full">
        {tabs.map((tab, idx) => {
          return <BottomBarTab key={idx} {...tab} />;
        })}
      </div>
    </div>
  );
}

function BottomBarTab({ title, active, icon, action }: BottomBarTabProps) {
  return (
    <div
      className={`btn btn-ghost px-1 py-px rounded-none flex-nowrap !flex !flex-col flex-[1_1_0px] !h-auto overflow-hidden
      ${active ? `!bg-base-content !text-primary` : ''}
      `}
      onClick={() => {
        action?.();
      }}
    >
      <div className="text-2xl mb-px">{icon}</div>
      <div className="overflow-hidden w-full truncate text-sm">{title}</div>
    </div>
  );
}

export default BottomBar;
