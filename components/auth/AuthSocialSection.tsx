import React from "react";
import { FaGoogle, FaApple, FaFacebook } from "react-icons/fa";

function AuthSocialSection() {
  return (
    <>
      <span className="mx-auto text-lg font-bold opacity-50 sm:text-xl">
        Or login with
      </span>

      <div className="flex flex-col flex-wrap gap-2 sm:flex-row sm:gap-4">
        <button
          className="btn btn-primary flex-1 flex-nowrap gap-x-2
    text-clip text-lg font-bold sm:gap-x-4 sm:text-lg"
        >
          <span className="text-xl sm:text-2xl">
            <FaGoogle />
          </span>
          Google
        </button>
        <button
          className="btn btn-primary flex-1 flex-nowrap gap-x-2
    text-clip text-lg font-bold sm:gap-x-4 sm:text-lg"
        >
          <span className="text-xl sm:text-2xl">
            <FaApple />
          </span>
          Apple
        </button>
        <button
          className="btn btn-primary flex-1 flex-nowrap gap-x-2
    text-clip text-lg font-bold sm:gap-x-4 sm:text-lg"
        >
          <span className="text-xl sm:text-2xl">
            <FaFacebook />
          </span>
          Facebook
        </button>
      </div>
    </>
  );
}

export default React.memo(AuthSocialSection);
