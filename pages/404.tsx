import { useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import {
  MdArrowBack,
  MdHome,
  MdOutlineSentimentVeryDissatisfied,
} from "react-icons/md";
import { routeHistoryAtom } from "../app/hooks/RouteChangeHook";
import { smartBack } from "../ui/helpers/RouterSmartBackHelpers";

function Custom404() {
  const router = useRouter();
  const [history] = useAtom(routeHistoryAtom);

  return (
    <div className="flex flex-col min-h-[100vh]">
      <div className="mx-auto p-4 flex flex-col items-center mt-24">
        <MdOutlineSentimentVeryDissatisfied className="h-36 w-36 sm:h-48 sm:w-48 text-error" />
        <div className="mb-2 sm:mb-4 text-center">
          <span className="text-lg sm:text-2xl font-bold">
            Something is wrong
          </span>
          <br />
          <span className="text-base sm:text-lg brightness-50">
            Cannot find the page you are looking for
          </span>
        </div>
        <div className="flex gap-2 sm:gap-4">
          <button
            className="btn btn-primary text-lg sm:text-xl gap-2 sm:gap-4"
            onClick={() => smartBack(router, history)}
          >
            <MdArrowBack className="text-2xl sm:text-3xl" />
            Go back
          </button>
          <Link href={"/"} passHref>
            <a className="btn btn-primary text-lg sm:text-xl gap-2 sm:gap-4">
              <MdHome className="text-2xl sm:text-3xl" />
              Go to home
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Custom404;
