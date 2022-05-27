import Link from "next/link";
import React, { ReactNode } from "react";

export interface MainLinkProps {
  href: string;
  children: ReactNode;
  newTab?: boolean;
}

function MainLink({ href, children, newTab }: MainLinkProps) {
  return (
    <Link href={href} passHref>
      <a className="hover:underline" target={newTab ? "_blank" : "_self"} rel="noopener noreferrer">{children}</a>
    </Link>
  );
}

export default MainLink;
