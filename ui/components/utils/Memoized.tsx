import React, { ReactNode } from "react";

interface MemoizedProps {
  show: boolean;
  children: ReactNode;
}

function Memoized({ show, children }: MemoizedProps) {
  return <>{children}</>;
}

export default React.memo(Memoized, (prev, next) => {
  // memoize when hiding
  const hiding = prev.show === true && next.show === false;
  return hiding === true;
});
