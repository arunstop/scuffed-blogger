import Link from "next/link";
import React, { ReactNode } from "react";

export interface MainMenuItemProps {
  title: string;
  icon?: ReactNode;
  link?: string;
  indicator?: boolean;
  action?: () => void;
}

function MainMenuItem({
  title,
  icon,
  link,
  indicator = false,
  action = () => {},
}: MainMenuItemProps) {
  const content = (
    <li className="relative">
      <span className="flex gap-1 sm:gap-2 rounded-xl" onClick={action}>
        <span className="text-xl sm:text-2xl">{icon}</span>
        <span className="font-semibold text-sm sm:text-md md:text-lg">
          {title}
        </span>
      </span>
      {indicator && (
        <div className="absolute inset-y-0 right-0 m-auto pointer-events-none">
          <span
            className="absolute inset-0 m-auto h-2 w-2 origin-center transform animate-ping rounded-full
          bg-red-500 sm:h-4 sm:w-4"
          />
          <span className="absolute inset-0 m-auto h-2 w-2 rounded-full bg-red-500 sm:h-4 sm:w-4" />
        </div>
      )}
    </li>
  );
  return link ? (
    <Link href={link} passHref>
      <a tabIndex={-1}>{content}</a>
    </Link>
  ) : (
    content
  );
}

export default MainMenuItem;
