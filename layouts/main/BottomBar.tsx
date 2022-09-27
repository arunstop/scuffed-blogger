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
      active: router.pathname === "/" && !isSearching && !sidebar,
      action: () => {
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
      title: "Account",
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
    <div className={`fixed inset-x-0 bottom-0 sm:hidden ${`z-30`}`}>
      <div className="h-[3rem] bg-base-100 ring-1 ring-base-content/20 flex w-full">
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
      className={`btn btn-ghost px-1 py-px transition-all 
      flex-nowrap !flex !flex-col flex-[1_1_0px] !h-auto overflow-hidden rounded-none
      ${active ? `!bg-primary/70 !text-primary-content  ` : ""}
      `}
      onClick={() => {
        action?.();
      }}
    >
      <div
        className={`text-2xl mb-px  ${
          active
            ? "rotate-360 scale-125 duration-1000 transition-transform"
            : "transition-all  scale-[0.9] duration-500"
        }`}
      >
        {icon}
      </div>
      <div className="overflow-hidden w-full truncate text-sm">{title}</div>
    </div>
  );
}

export default BottomBar;
