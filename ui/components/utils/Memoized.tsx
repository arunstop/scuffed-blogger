import React, { ReactNode } from "react";

interface MemoizedProps {
  show: boolean;
  children: ReactNode;
}

function Memoized({ show, children }: MemoizedProps) {
  return <>{children}</>;
}

export default React.memo(Memoized, (prev, next) => {
  // if showing static show value then memoize it
  if (prev.show === true && next.show === true) return true;
  // or memoize when getting hidden while the previous state is showing
  const hiding = prev.show === true && next.show === false;
  return hiding === true;
});
