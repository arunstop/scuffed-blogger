import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  MdArticle,
  MdBookmark,
  MdDarkMode,
  MdEdit,
  MdFactCheck,
  MdLightMode,
  MdLogout,
  MdPerson,
  MdPlaylistAddCheck,
  MdWatchLater,
} from "react-icons/md";
import { useAuthCtx } from "../../utils/contexts/auth/AuthHook";
import { useUiCtx } from "../../utils/contexts/ui/UiHook";
import { waitFor } from "../../utils/helpers/DelayHelpers";
import ModalDialog from "../modal/ModalDialog";
import MainMenuItem, { MainMenuItemProps } from "./MainMenuItem";

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

  const allMenus: (MainMenuItemProps & { show: boolean })[] = [
    {
      title: "Edit Profile",
      icon: <MdEdit />,
      action: () => {
        closeDrawer();
      },
      show: user?.profileCompletion === "COMPLETE",
    },
    {
      title: "Finish your profile setup",
      icon: <MdFactCheck />,
      link: `/profile/setup`,
      action: () => {
        closeDrawer();
      },
      indicator: user?.profileCompletion === "REQ_SETUP",
      show: user?.profileCompletion === "REQ_SETUP",
    },
    {
      title: "Choose topics",
      icon: <MdPlaylistAddCheck />,
      link: `/profile/choosetopic`,
      action: () => {
        closeDrawer();
      },
      indicator: user?.profileCompletion === "REQ_CHOOSE_TOPIC",
      show: user?.profileCompletion === "REQ_CHOOSE_TOPIC",
    },
    {
      title: "Go to your page",
      icon: <MdPerson />,
      link: `/author/${user?.email}`,
      action: () => {
        closeDrawer();
      },
      show: true,
    },
    {
      title: "Posts",
      icon: <MdArticle />,
      action: () => {
        closeDrawer();
      },
      show: true,
    },
    {
      title: "Bookmarks",
      icon: <MdBookmark />,
      action: () => {
        closeDrawer();
      },
      show: true,
    },
    {
      title: "Read Laters",
      icon: <MdWatchLater />,
      action: () => {
        closeDrawer();
      },
      show: true,
    },
    {
      title: darkMode ? "Switch to Light mode" : "Switch to Dark mode",
      icon: darkMode ? (
        <MdLightMode className="text-yellow-500" />
      ) : (
        <MdDarkMode className="text-blue-500" />
      ),
      action: () => {
        closeDrawer();
        uiAct.toggleDarkMode(!darkMode);
      },
      show: true,
    },
    {
      title: "Logout",
      icon: <MdLogout />,
      action: async () => {
        setDialogLogout(true);
      },
      show: true,
    },
  ];

  const shownMenus = allMenus.filter((e) => e.show);

  const [drawer, setDrawer] = useState(false);
  const [dialogLogout, setDialogLogout] = useState(false);

  function closeDrawer() {
    // blur out everything
    (document.activeElement as HTMLElement).blur();
    setDrawer(false);
  }

  function handleKeyPress(ev: KeyboardEvent) {
    console.log(ev.key);
    if (ev.key === "Escape") {
      closeDrawer();
    }
  }

  //   Key listener
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
    <>
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
        <div className="drawer-side overflow-hidden">
          {/* OVERLAY */}
          <label
            htmlFor="main-drawer"
            className="drawer-overlay pointer-events-auto !cursor-default backdrop-blur-sm !bg-black/60"
          />
          <div className="flex flex-col gap-2 sm:gap-4 p-2 sm:p-4 overflow-y-auto w-80 bg-base-100 pointer-events-auto">
            <div className="flex flex-col gap-2 sm:gap-4 items-center">
              <div
                className="overflow-hidden rounded-full border-[1px] sm:border-2 border-offset-2 border-base-content 
              h-12 w-12 sm:h-20 sm:w-20 "
              >
                <img
                  src={user?.avatar}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-center">
                <span className="line-clamp-2 font-bold text-md sm:text-lg md:text-xl">
                  {user?.name}
                </span>
                <span className="font-bold text-sm sm:text-md md:text-lg text-base-content text-opacity-50">
                  {`@${user?.username}`}
                </span>
              </p>
            </div>
            <ul className="menu">
              {shownMenus.map((e, idx) => (
                <MainMenuItem key={idx} {...e} />
              ))}
            </ul>
          </div>
        </div>
      </div>
      <ModalDialog
        value={dialogLogout}
        onClose={() => setDialogLogout(false)}
        title={"Logout"}
        desc={`Are you sure you want to end this authentication session?`}
        actionN={() => {
          setDialogLogout(false);
        }}
        actionY={async () => {
          setDialogLogout(false);
          closeDrawer();
          await waitFor(1000);
          authAct.unsetUser();
        }}
      />
    </>
  );
}

export default React.memo(Sidebar);
