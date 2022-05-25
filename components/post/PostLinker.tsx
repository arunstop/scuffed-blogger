import Link from "next/link";
import React, { ReactNode } from "react";

interface PostLinkerProps {
  href: string;
  className?: string;
  children?: ReactNode;
}

function PostLinker({ href, className, children }: PostLinkerProps) {
  return (
    <Link href={href} passHref>
      <a className={className}>{children}</a>
    </Link>
  );
}

export default PostLinker;
