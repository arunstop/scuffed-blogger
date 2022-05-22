import React, { ReactNode } from "react";
export interface MainTabItemProps {
  icon: ReactNode;
  title: string;
  active: boolean;
  onClick?: (title:string) => void;
}

function MainTabItem({ icon, title, active, onClick }: MainTabItemProps) {
    console.log(title);
  return (
    <a
      className={`w-full sm:flex-1 tab text-sm sm:text-base btn btn-ghost border-0
      flex flex-col h-auto p-2 sm:p-4 transition-all gap-1 sm:gap-2
      first:!rounded-l-xl last:!rounded-r-xl
      ${
        active
          ? "tab-active !rounded-xl z-[1] -mx-4 first:-mr-4 last:-ml-4"
          : "hover:bg-primary-focus/30 !rounded-none"
      }`}
      onClick={() => !active && onClick?.(title)}
    >
      {icon}
      <span className="font-black">{title}</span>
    </a>
  );
}

export default React.memo(MainTabItem);
