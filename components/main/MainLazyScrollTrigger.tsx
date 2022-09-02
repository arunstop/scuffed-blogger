import React from "react";
import useLazyScrollerHook from "../../utils/hooks/LazyScrollerHook";

function MainLazyScrollTrigger({
  callback,
  delay,
  ...props
}: {
  callback: () => void;
  delay?: number;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { ref, load, setLoad } = useLazyScrollerHook({
    callback: callback,
    delay: delay,
  });
  return <div ref={ref} {...props} ></div>;
}

export default MainLazyScrollTrigger;
