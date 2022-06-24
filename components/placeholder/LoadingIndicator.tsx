import React from "react";
import { MdWorkspaces } from "react-icons/md";
interface LoadingIndicatorProps {
  text: string;
  spinner?: boolean;
}
function LoadingIndicator({
  text,
  spinner = false,
}: LoadingIndicatorProps) {
  return (
    <div
      className="wrap mx-auto my-4 flex items-center justify-center gap-2 
      text-center text-lg font-bold sm:gap-4 sm:text-xl md:my-8 lg:my-12 xl:my-16"
    >
      {spinner && (
        <MdWorkspaces className="animate-spin text-2xl sm:text-3xl" />
      )}
      <span>{text}</span>
    </div>
  );
}

export default LoadingIndicator;
