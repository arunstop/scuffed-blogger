import React from "react";

// Ref on custom component needs to be forwarded
// reference: https://stackoverflow.com/a/66876771
interface MainSectionSkeletonProps {
  text?: string;
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
      {spinner && (
        <div className="inline-flex flex-nowrap animate-pulse">
          <span className="animate-[bounce_1s_ease-in-out_0.4s_infinite] text-5xl font-black ">
            &middot;
          </span>
          <span className="animate-[bounce_1s_ease-in-out_0.6s_infinite] text-5xl font-black ">
            &middot;
          </span>
          <span className="animate-[bounce_1s_ease-in-out_0.8s_infinite] text-5xl font-black ">
            &middot;
          </span>
        </div>
      )}
      <span>{props.text}</span>
    </div>
  );
});

MainSectionSkeleton.displayName = "MainSectionSkeleton";

export default MainSectionSkeleton;
