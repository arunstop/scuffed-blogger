import React from "react";
import { MdWorkspaces } from "react-icons/md";
interface LoadingPlaceholderProps {
  title: string;
  desc: string;
  actionLabel? :string;
  action?: () => void;
}
function LoadingPlaceholder({
  title,
  desc,
  actionLabel="Ok",
  action,
}: LoadingPlaceholderProps) {
  return (
    <div
      className="flex flex-col mx-auto justify-center items-center 
      bg-gradient-to-r from-transparent via-primary/40 dark:via-primary/20 to-transparent
      gap-2 sm:gap-4 rounded-[10%] py-2 sm:py-4 px-4 sm:px-8 min-w-[50%] sm:max-w-2xl text-center
      my-4 sm:my-8 pb-4"
    >
      <MdWorkspaces className="text-[4rem] sm:text-[5rem] animate-spin text-primary" />
      <p className="flex flex-col gap-1 sm:gap-2 text-center">
        <span className="font-black text-2xl sm:text-3xl">{title}</span>
        <span className="text-sm sm:text-base font-semibold">{desc}</span>
      </p>
      <button className=" btn --btn-resp" onClick={action}>
        {actionLabel}
      </button>
    </div>
  );
}

export default LoadingPlaceholder;
