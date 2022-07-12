import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { MdSearch } from "react-icons/md";
import { useAuthCtx } from "../utils/contexts/auth/AuthHook";
import { useUiCtx } from "../utils/contexts/ui/UiHook";
import { APP_NAME } from "../utils/helpers/Constants";
import { routeTrimQuery } from "../utils/helpers/MainHelpers";
import { useHeaderBehavior } from "../utils/hooks/HeaderBehaviorHook";
import { useSearchModalBehavior } from "../utils/hooks/SearchModalBehaviorHook";
import MainHeaderBigSearchBar from "./main/MainHeaderBigSearchBar";
import SearchModal from "./main/SearchModal";
import Sidebar from "./main/Sidebar";

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
  // console.log("header");
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
  const { loggedIn, authStt: authState, authAct } = useAuthCtx();

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
            // onClick={
            //   router.pathname === "/"
            //     ? () => {
            //         scrollToTop();
            //       }
            //     : undefined
            // }
          >
            {APP_NAME}
          </a>
        </Link>
        {router.pathname !== "/auth" ? <MainHeaderBigSearchBar /> : null}

        {/* RIGHT BUTTONS */}
        <div className="inline-flex items-center gap-1 sm:gap-2 ">
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
                    className="--btn-resp btn btn-ghost btn-circle text-base-content"
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

              {router.pathname !== "/write" && (
                <Link href="/write" passHref>
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
                      Write
                    </button>
                  </a>
                </Link>
              )}

              {!loggedIn && (
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
              )}
            </>
          )}
          {authState.user && (
            <label
              htmlFor="main-drawer"
              className="cursor-pointer overflow-hidden rounded-full border-[1px] sm:border-2 border-offset-2 border-base-content 
              h-8 w-8 sm:h-12 sm:w-12 "
            >
              <img src={authState.user.avatar} className="h-8 w-8 sm:h-12 sm:w-12 object-cover" />
            </label>
          )}
        </div>
      </div>
      <Sidebar />
      <SearchModal value={searchModal} onClose={closeSearchModal} />
    </>
  );
}

export default Header;
