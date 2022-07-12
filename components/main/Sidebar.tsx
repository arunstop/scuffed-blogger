import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  MdEdit,
  MdLogout,
  MdOutlineDarkMode,
  MdOutlineLightMode,
  MdPerson,
} from "react-icons/md";
import { useAuthCtx } from "../../utils/contexts/auth/AuthHook";
import { useUiCtx } from "../../utils/contexts/ui/UiHook";
import MainMenuItem, { MainMenuItemProps } from "./MainMenuItem";
const drawerValue = document.getElementById("main-drawer") as HTMLInputElement;

function Sidebar() {
  const {
    authStt: { user },
    authAct,
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
      action: () => {
        closeDrawer();
        authAct.unsetUser();
      },
    },
  ];

  const [drawer, setDrawer] = useState(false);

  function closeDrawer() {
    setDrawer(false);
  }

  function handleKeyPress(ev: KeyboardEvent) {
    console.log(ev.key);
    if (ev.key === "Escape") {
      closeDrawer();
    }
  }

  useEffect(() => {
    //   only listen to keydown when drawer shows
    if (drawer) window.addEventListener("keydown", handleKeyPress);
    // otherwise remove it
    else window.removeEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [drawer]);

  return (
    <div className="fixed inset-0 drawer drawer-end z-10 pointer-events-none">
      <input
        id="main-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={drawer}
        onChange={(e) => {
          setDrawer(e.target.checked);
        }}
      />
      {/* USELESS CONTENT */}
      {/* <div className="drawer-content"></div> */}
      <div className="drawer-side">
        {/* OVERLAY */}
        <label
          htmlFor="main-drawer"
          className="drawer-overlay pointer-events-auto !cursor-default"
        />
        <div className="flex flex-col gap-2 sm:gap-4 p-2 sm:p-4 overflow-y-auto w-80 bg-base-100 pointer-events-auto">
          <div className="flex flex-col gap-2 sm:gap-4 items-center">
            <div
              className="overflow-hidden rounded-full border-[1px] sm:border-2 border-offset-2 border-base-content 
              h-12 w-12 sm:h-20 sm:w-20 "
            >
              <img
                src={user?.avatar}
                className="h-12 w-12 sm:h-20 sm:w-20 object-cover"
              />
            </div>
            <p className="text-center">
              <span className="line-clamp-2 font-bold text-md sm:text-lg md:text-xl">
                {user?.name}
              </span>
              <span className="font-bold text-sm sm:text-md md:text-lg text-base-content text-opacity-50">
                {user?.email}
              </span>
            </p>
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
