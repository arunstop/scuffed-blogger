import React from "react";
import MainSpinner from "./MainSpinner";

// Ref on custom component needs to be forwarded
// reference: https://stackoverflow.com/a/66876771
interface MainSectionSkeletonProps {
  text: string;
  spinner?: boolean;
}
const MainSectionSkeleton = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<MainSectionSkeletonProps>
>(({ spinner = false, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className="wrap mx-auto flex justify-center items-center gap-2 text-center 
      text-lg font-bold sm:gap-4 sm:text-xl my-16 md:my-20 lg:my-24 xl:my-28"
    >
      {spinner && <MainSpinner />}
      <span>{props.text}</span>
    </div>
  );
});

MainSectionSkeleton.displayName = "MainSectionSkeleton";

export default MainSectionSkeleton;
