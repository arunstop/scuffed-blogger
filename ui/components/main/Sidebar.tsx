import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
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
import { useAuthCtx } from "../../../app/contexts/auth/AuthHook";
import { useUiCtx } from "../../../app/contexts/ui/UiHook";
import { waitFor } from "../../../app/helpers/DelayHelpers";
import { routeTrimQuery } from "../../../app/helpers/MainHelpers";
import { useRoutedModalHook } from "../../../app/hooks/RoutedModalHook";
import { useUiSidebarBehaviorHook } from "../../../app/hooks/UiSidebarBehaviorHook";
import ModalConfirmation from "../modal/ModalConfirmation";
import MainMenuItem, { MainMenuItemProps } from "./MainMenuItem";
import MobileHeader from "./MobileHeader";

function Sidebar() {
  const router = useRouter();
  const {
    authStt: { user },
    authAct,
  } = useAuthCtx();

  const {
    uiStt: { darkMode },
    uiAct,
  } = useUiCtx();

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
      link: `/profile/choosetopics`,
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
      link: `/user/posts`,
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
        // closeDrawer();
        uiAct.toggleDarkMode(!darkMode);
      },
      show: true,
    },
    {
      title: "Logout",
      icon: <MdLogout />,
      action: async () => {
        setDialogLogout(true, true);
      },
      show: true,
    },
  ];

  const shownMenus = allMenus.filter((e) => e.show);

  const { show: dialogLogout, toggle: setDialogLogout } =
    useRoutedModalHook("logout");

  const { sidebar, openSidebar, closeSidebar } = useUiSidebarBehaviorHook();

  function closeDrawer() {
    // blur out everything
    (document.activeElement as HTMLElement).blur();
    closeSidebar();
  }

  function handleKeyPress(ev: KeyboardEvent) {
    // console.log(ev.key);
    if (ev.key === "Escape") {
      closeDrawer();
    }
  }

  const scrollContentToTop = useCallback(() => {
    const ElModalContent = document.getElementById("sidebar-content");
    if (ElModalContent)
      return ElModalContent.scrollTo({
        top: 0,
        behavior: "smooth",
      });
  }, []);

  //   Key listener
  useEffect(() => {
    //   only listen to keydown when drawer shows
    if (sidebar) window.addEventListener("keydown", handleKeyPress);
    // otherwise remove it
    else window.removeEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [sidebar]);

  return (
    <>
      <div className="drawer drawer-end pointer-events-none fixed inset-0 z-20">
        <input
          id="main-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={sidebar}
          onChange={(e) => {
            if (e.target.checked) return openSidebar();
            return closeSidebar();
          }}
        />
        {/* USELESS CONTENT */}
        {/* <div className="drawer-content"></div> */}
        <div tabIndex={-1} className="drawer-side overflow-hidden">
          {/* OVERLAY */}
          <label
            htmlFor="main-drawer"
            className="drawer-overlay pointer-events-auto hidden !cursor-default !bg-black/60 backdrop-blur-sm sm:block"
          />
          {!user && (
            <div className="pointer-events-auto flex w-full  bg-base-100 p-8">
              <div className="m-auto flex flex-col   gap-4 text-center">
                <span className="mb-4 text-xl font-bold">
                  Join us and let the world know your thought!
                </span>
                <Link
                  href={{
                    pathname: "/auth",
                    query: {
                      redirect: `${routeTrimQuery(router.asPath)}`,
                    },
                  }}
                  passHref
                >
                  <a tabIndex={-1} className="btn-primary btn text-xl">
                    Login
                  </a>
                </Link>
                <Link
                  href={{
                    pathname: "/auth",
                    query: {
                      redirect: `${routeTrimQuery(router.asPath)}`,
                    },
                  }}
                  passHref
                >
                  <a tabIndex={-1} className="btn-primary btn text-xl">
                    Register
                  </a>
                </Link>
                <a
                  tabIndex={-1}
                  className="btn-outline btn-primary btn text-xl"
                  onClick={() => closeSidebar()}
                >
                  Not now
                </a>
              </div>
            </div>
          )}
          {user && (
            <div className="pointer-events-auto mb-[3rem] flex w-full flex-col gap-4 overflow-y-auto bg-base-100 sm:mb-0 sm:w-80">
              <MobileHeader
                back={() => closeSidebar()}
                title="Account"
                toTop={scrollContentToTop}
              />
              <div
                id={`sidebar-content`}
                className="flex w-full flex-col gap-4 overflow-y-auto p-4"
              >
                <div className="relative flex p-4">
                  <img
                    src={user?.avatar}
                    className="absolute inset-0 h-full w-full rounded-xl object-cover p-2 opacity-70 blur-md"
                  />
                  <div className="z-[1] flex w-full items-center gap-2 sm:mx-auto sm:flex-col sm:gap-4 sm:px-0">
                    <div
                      className="border-offset-2 h-12 w-12 overflow-hidden rounded-full border-[1px] 
                    border-base-content bg-base-content/30 sm:h-20 sm:w-20 sm:border-2"
                    >
                      <img
                        src={user?.avatar}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span
                      className="sm:flex-0 flex flex-1 flex-col gap-1 rounded-lg bg-primary/30 py-2 
                      text-start backdrop-blur-sm sm:gap-2 sm:text-center sm:min-w-[50%] max-w-[80%] px-2 sm:px-4"
                    >
                      <span className="text-md font-bold leading-none line-clamp-2 sm:text-lg md:text-xl ">
                        {user?.name}
                      </span>
                      <span className="sm:text-md text-sm font-bold text-base-content text-opacity-50 md:text-lg">
                        {`@${user?.username}`}
                      </span>
                    </span>
                  </div>
                </div>
                <ul className="menu">
                  {shownMenus.map((e, idx) => (
                    <MainMenuItem key={idx} {...e} />
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      <ModalConfirmation
        value={dialogLogout}
        title={`Log out`}
        desc={`Any unsaved progress will be lost. Are you sure you want to end this session?`}
        onClose={() => setDialogLogout(false)}
        onConfirm={async () => {
          setDialogLogout(false);
          closeDrawer();
          await waitFor(1000);
          authAct.unsetUser();
          uiAct.addToast({
            label: "We hope to see you again!",
            type: "success",
          });
        }}
        labelOk={"Logout"}
      />
    </>
  );
}

export default React.memo(Sidebar);
