import React from "react";
import LoadingIndicator from "./LoadingIndicator";

// Ref on custom component needs to be forwarded
// reference: https://stackoverflow.com/a/66876771
interface MainSectionSkeletonProps {
  text: string;
  spinner?: boolean;
}
const SectionSkeleton = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<MainSectionSkeletonProps>
>(({ spinner = false, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className="wrap mx-auto flex justify-center items-center gap-2 text-center 
      text-lg font-bold sm:gap-4 sm:text-xl my-16 md:my-20 lg:my-24 xl:my-28"
    >
      {spinner && <LoadingIndicator spinner />}
      <span>{props.text}</span>
    </div>
  );
});

SectionSkeleton.displayName = "SectionSkeleton";

export default SectionSkeleton;
