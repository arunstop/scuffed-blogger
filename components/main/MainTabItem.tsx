import React, { ReactNode } from "react";
export interface MainTabItemProps {
  icon: ReactNode;
  title: string;
  active: boolean;
  onClick?: (title: string) => void;
}

function MainTabItem({ icon, title, active, onClick }: MainTabItemProps) {
  console.log(title);
  return (
    <a
      className={`tab tab-lg  text-lg sm:text-xl !rounded-xl font-bold transition-colors
      gap-2 sm:gap-4 text-ellipsis overflow-hidden text-opacity-100 border-1 btn
      ${
        active
          ? `tab-active !border-primary`
          : "!border-base-content/80 btn-outline"
      }`}
      onClick={() => !active && onClick?.(title)}
    >
      {icon}
      <span className="font-black">{title}</span>
    </a>
  );
}

export default React.memo(MainTabItem);
