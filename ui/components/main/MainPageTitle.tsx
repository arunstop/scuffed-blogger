import { useRouter } from "next/router";
import React from "react";
import { MdArrowBack } from "react-icons/md";
interface PropsMainPageTitle {
  title: string;
  backButton: boolean;
}
const MainPageTitle = ({ title, backButton }: PropsMainPageTitle) => {
  const router = useRouter();
  return (
    <div className="flex gap-2 sm:gap-4 items-center">
      {backButton && (
        <button
          className="btn btn-circle btn-ghost self-start min-h-0 !h-9 !w-9 sm:!h-12 sm:!w-12"
          onClick={() => router.back()}
        >
          <MdArrowBack className="text-3xl sm:text-5xl text-primary" />
        </button>
      )}
      <span className="text-3xl font-bold sm:text-5xl">{title}</span>
    </div>
  );
};

export default MainPageTitle;
