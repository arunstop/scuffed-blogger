import Link from "next/link";
import React, { ReactNode } from "react";

export interface MainMenuItemProps {
  title: string;
  icon?: ReactNode;
  link?: string;
  action?: () => void;
}

function MainMenuItem({
  title,
  icon,
  link,
  action = () => {},
}: MainMenuItemProps) {
  const content = (
    <li>
      <span className="flex gap-1 sm:gap-2 rounded-xl" onClick={action}>
        <span className="text-xl sm:text-2xl">{icon}</span>
        <span className="font-semibold text-sm sm:text-md md:text-lg">{title}</span>
      </span>
    </li>
  );
  return link ? (
    <Link href={link} passHref>
      <a>{content}</a>
    </Link>
  ) : (
    content
  );
}

export default MainMenuItem;
