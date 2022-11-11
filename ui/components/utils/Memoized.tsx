import React, { ReactNode } from "react";

interface MemoizedProps {
  show: boolean;
  once?: boolean;
  children: ReactNode;
}

function Memoized({ show, children }: MemoizedProps) {
  return <>{children}</>;
}

export default React.memo(Memoized, (prev, next) => {
  if (prev.once === true || next.once === true) return true;
  // When showing => RE-RENDER (Don't memoize)
  // When hiding => MEMOIZE
  // NOTE : if you flip out this logic
  // meaning useing `prev.show && !next.show` 
  // IT WON'T WORK, idk why
  const showing = !prev.show && next.show;
  return !showing;
});
