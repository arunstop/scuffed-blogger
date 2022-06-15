import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import {
  MdOutlineDarkMode,
  MdOutlineLightMode,
  MdSearch,
} from "react-icons/md";
import { useUiCtx } from "../utils/contexts/ui/UiHook";
import { APP_NAME } from "../utils/helpers/Constants";
import { routeTrimQuery } from "../utils/helpers/RouteHelpers";
import { useHeaderBehavior } from "../utils/hooks/HeaderBehaviorHook";
import { useSearchModalBehavior } from "../utils/hooks/SearchModalBehaviorHook";
import MainHeaderBigSearchBar from "./main/MainHeaderBigSearchBar";
import SearchModal from "./main/SearchModal";

// function scrollListener(event: Event) {
//   const element = event.target as Element;
//   const header = getHeaderEl();
//   const scrolledToTop = element.scrollTop === 0;
//   if (scrolledToTop) {
//     header!.classList.remove("bg-primary/50", "shadow-lg");
//   } else {
//     header!.classList.add("bg-primary/50", "shadow-lg");
//   }
// }

function Header() {
  console.log("header");
  const {
    uiStt: { darkMode },
    uiAct,
  } = useUiCtx();

  const router = useRouter();

  const [scrolledToTop, setScrolledToTop] = useState(true);
  const scrollToTopCallback = useCallback(
    (value: boolean) => {
      if (value !== scrolledToTop) setScrolledToTop(value);
    },
    [scrolledToTop],
  );

  useHeaderBehavior(scrollToTopCallback);

  const { searchModal, closeSearchModal } = useSearchModalBehavior();

  // const [searchModal, setSearchModal] = useState(false);
  // const closeSearchModal = useCallback(() => {
  //   setSearchModal(false);
  // }, []);

  return (
    <>
      <div
        className={`sticky flex flex-row gap-4 top-0 z-10 h-12 sm:h-16 w-full items-center 
        px-2 sm:px-4 justify-between transition-all duration-[600ms] text-primary
        `}
        id="header"
      >
        <Link href="/" passHref>
          <a
            className={`text-lg sm:text-xl md:text-2xl font-black
          `}
          >
            {APP_NAME}
          </a>
        </Link>
        {(router.pathname !== "/auth") && (
          <MainHeaderBigSearchBar />
        )}

        <div className="inline-flex items-center gap-2 sm:gap-4">
          {router.pathname !== "/auth" && (
            <>
              <div className="block md:hidden">
                {/* <div className="block"> */}
                <Link
                  href={{
                    pathname: routeTrimQuery(router.asPath),
                    query: {
                      search: true,
                    },
                  }}
                  shallow
                >
                  <a
                    className="btn btn-circle btn-ghost text-base-content --btn-resp"
                    role={"button"}
                  >
                    <span
                      className={`text-2xl transition-colors ${
                        scrolledToTop ? "text-primary" : ""
                      } `}
                    >
                      <MdSearch />
                    </span>
                  </a>
                </Link>
              </div>

              <Link href="/auth" passHref>
                <a>
                  <button
                    className={`btn --btn-resp font-bold transition-all duration-[600ms] truncate
                  text-lg sm:text-xl
                  ${scrolledToTop ? "btn-primary" : "btn-outline"}
                  `}
                    style={
                      {
                        // borderColor: scrolledToTop ? "hsl(var(--p))" : "",
                        // color: scrolledToTop ? "hsl(var(--p))" : "",
                      }
                    }
                  >
                    Join now
                  </button>
                </a>
              </Link>
            </>
          )}
          <label className="swap swap-rotate btn  btn-ghost btn-sm sm:btn-md btn-circle">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(ev) => {
                uiAct.toggleDarkMode(ev.target.checked);
              }}
            />
            <span
              className="swap-on text-2xl sm:text-3xl text-yellow-500"
              title="Turn on Dark Mode"
            >
              <MdOutlineLightMode />
            </span>
            <span
              className="swap-off text-2xl sm:text-3xl text-blue-500"
              title="Turn on Light Mode"
            >
              <MdOutlineDarkMode />
            </span>
          </label>
        </div>
      </div>
      <SearchModal value={searchModal} onClose={closeSearchModal} />
    </>
  );
}

export default Header;
