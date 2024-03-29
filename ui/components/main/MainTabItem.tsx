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
      className={`tab tab-sm sm:tab-lg --btn-resp !min-h-0 btn font-bold
      gap-2 sm:gap-4 text-ellipsis overflow-hidden border-1 !rounded-xl
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
