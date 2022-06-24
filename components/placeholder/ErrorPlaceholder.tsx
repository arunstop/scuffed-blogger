import React from "react";
import { IoMdCloseCircle } from "react-icons/io";
interface ErrorPlaceholderProps {
  title: string;
  desc: string;
  actionLabel? :string;
  action?: () => void;
}
function ErrorPlaceholder({
  title,
  desc,
  actionLabel="Ok",
  action,
}: ErrorPlaceholderProps) {
  return (
    <div
      className="flex flex-col mx-auto justify-center items-center 
      bg-gradient-to-r from-transparent via-error/40 dark:via-error/20 to-transparent
      gap-2 sm:gap-4 rounded-[10%] py-2 sm:py-4 px-4 sm:px-8 min-w-[50%] sm:max-w-2xl text-center
      my-4 sm:my-8 pb-4"
    >
      <IoMdCloseCircle className="text-[4rem] sm:text-[5rem] animate-pulse text-error" />
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

export default ErrorPlaceholder;
