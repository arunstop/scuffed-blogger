import Link from "next/link";
import React from "react";
import { MdHome, MdOutlineSentimentVeryDissatisfied } from "react-icons/md";

function Custom404() {
  return (
    <div className="flex flex-col min-h-[100vh]">
      <div className="mx-auto p-4 flex flex-col items-center mt-24">
        <MdOutlineSentimentVeryDissatisfied className="h-36 w-36 sm:h-48 sm:w-48 text-error" />
        <div className="mb-2 sm:mb-4 text-center">
          <span className="text-lg sm:text-2xl font-bold">Something is wrong</span><br/>
          <span className="text-base sm:text-lg brightness-50">Cannot find the page you are looking for</span>
        </div>
        <Link href={"/"} passHref>
          <a className="btn btn-primary text-lg sm:text-xl gap-2 sm:gap-4">
          <MdHome className="text-2xl sm:text-3xl"/>
          Go to home
          </a>
        </Link>
      </div>
    </div>
  );
}

export default Custom404;
