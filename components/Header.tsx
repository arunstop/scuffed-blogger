import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { useUiCtx } from "../utils/contexts/ui/UiHook";
import { APP_NAME } from "../utils/helpers/Constants";
import { useHeaderBehavior } from "../utils/hooks/HeaderBehaviorHook";

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
  const {
    uiStt: { darkMode },
    uiAct,
  } = useUiCtx();

  const router = useRouter();
  useHeaderBehavior();
  return (
    <div
      className={`sticky flex flex-row gap-4 top-0 z-10 h-12
      w-full items-center px-4 justify-between transition-all duration-[600ms]
      `}
      id="header"
    >
      <Link href="/" passHref>
        <a className="text-lg sm:text-xl md:text-2xl font-black">{APP_NAME}</a>
      </Link>
      <div className="inline-flex items-center gap-2 sm:gap-4">
        {router.pathname !== "/auth" && (
          <Link href="/auth" passHref>
            <a>
              <button className="btn btn-sm btn-outline font-bold">
                Write
              </button>
            </a>
          </Link>
        )}
        <label className="swap swap-rotate">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(ev) => {
              uiAct.toggleDarkMode(ev.target.checked);
            }}
          />
          <MdOutlineLightMode className="swap-on text-2xl sm:text-3xl" />
          <MdOutlineDarkMode className="swap-off text-2xl sm:text-3xl" />
        </label>
      </div>
    </div>
  );
}

export default Header;
