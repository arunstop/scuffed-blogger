import { useRouter } from "next/router";
import React from "react";
import {
    MdEdit, MdLogout, MdOutlineDarkMode, MdOutlineLightMode, MdPerson
} from "react-icons/md";
import { useAuthCtx } from "../../utils/contexts/auth/AuthHook";
import { useUiCtx } from "../../utils/contexts/ui/UiHook";
import MainMenuItem, { MainMenuItemProps } from "./MainMenuItem";

function Sidebar() {
  const {
    authState: { user },
  } = useAuthCtx();

  const {
    uiStt: { darkMode },
    uiAct,
  } = useUiCtx();

  const router = useRouter();

  const menus: MainMenuItemProps[] = [
    {
      title: "Edit Profile",
      icon: <MdEdit />,
    },
    {
      title: "Go to your page",
      icon: <MdPerson />,
      link: `/author/${user?.email}`,
    },
    {
      title: darkMode ? "Switch to Light mode" : "Switch to Dark mode",
      icon: darkMode ? (
        <MdOutlineLightMode className="text-yellow-500" />
      ) : (
        <MdOutlineDarkMode className="text-blue-500" />
      ),
      action: () => uiAct.toggleDarkMode(!darkMode),
    },
    {
      title: "Logout",
      icon: <MdLogout />,
      action: () => closeDrawer(),
    },
  ];

  function closeDrawer() {
    const drawerValue = document.getElementById(
      "main-drawer",
    ) as HTMLInputElement;
    drawerValue.checked = false;
  }

  return (
    <div className="fixed inset-0 drawer drawer-end z-10 pointer-events-none">
      <input id="main-drawer" type="checkbox" className="drawer-toggle" />
      {/* USELESS CONTENT */}
      {/* <div className="drawer-content"></div> */}
      <div className="drawer-side">
        {/* OVERLAY */}
        <label
          htmlFor="main-drawer"
          className="drawer-overlay pointer-events-auto !cursor-default"
        />
        <div className="flex flex-col gap-2 sm:gap-4 p-4 overflow-y-auto w-80 bg-base-100 pointer-events-auto">
          <div className="flex gap-2 sm:gap-4 items-center">
            <img
              src={user?.avatar}
              className="bg-primary w-12 h-12 rounded-full"
            />
            <span className="line-clamp-2 font-bold text-sm sm:text-md md:text-lg lg:text-xl">
              {user?.name}
            </span>
          </div>
          <ul className="menu">
            {menus.map((e, idx) => (
              <MainMenuItem key={idx} {...e} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
