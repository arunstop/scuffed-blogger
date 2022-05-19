import React from "react";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { useUiCtx } from "../utils/contexts/ui/UiHook";
import { APP_NAME } from "../utils/helpers/constants";

function Header() {
  const { uiStt, uiAct } = useUiCtx();
  return (
    <div
      className="sticky flex flex-row gap-4 top-0 z-10 h-12 
      w-full bg-red-500 items-center shadow-lg px-4 justify-between
      text-white"
      id="header"
    >
      <span>
        {APP_NAME}
        {uiStt.darkMode}
      </span>
      <label className="swap swap-rotate text-2xl sm:text-3xl">
        <input
          type="checkbox"
          checked={uiStt.darkMode}
          onChange={(ev) => {
            uiAct.toggleDarkMode(ev.target.checked);
          }}
        />
        <MdOutlineLightMode className="swap-on" />
        <MdOutlineDarkMode className="swap-off" />
      </label>
    </div>
  );
}

export default Header;
