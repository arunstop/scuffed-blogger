import Link from "next/link";
import React, { ReactNode } from "react";

export interface MainLinkProps {
  href: string;
  children: ReactNode;
  className?:string;
  newTab?: boolean;
}

function MainLink({ href, children,className="hover:underline", newTab }: MainLinkProps) {
  return (
    <Link href={href} passHref>
      <a className={className} target={newTab ? "_blank" : "_self"} rel="noopener noreferrer">{children}</a>
    </Link>
  );
}

export default MainLink;
