import React from "react";
import { useIntersectionObserverHook } from "../../utils/hooks/IntersectionObserverHook";

function MainIntersectionObserverTrigger({
  callback,
  ...props
}: {
  callback: (intersecting: boolean) => void;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { ref } = useIntersectionObserverHook({
    callback,
  });
  return <div ref={ref} {...props}></div>;
}

export default MainIntersectionObserverTrigger;
