import React from "react";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";
import { MdEmail, MdLock } from "react-icons/md";
import { APP_NAME } from "../../utils/helpers/Constants";
import GradientBackground from "../main/GradientBackground";
function AuthPanel() {
  return (
    // <div
    //   className="m-auto rounded-xl bg-base-300 ring-2 ring-base-content/20 shadow-xl
    //   w-full sm:max-w-md md:max-w-lg lg:max-w-xl relative z-0 overflow-hidden"
    // >
    <div className="relative z-0 overflow-hidden rounded-xl">
      <GradientBackground />

      <div className="mx-auto flex w-full flex-col gap-4 p-4 sm:max-w-md sm:gap-8 sm:p-8 md:max-w-lg lg:max-w-xl">
        <span className="my-3 text-center text-2xl font-black sm:text-3xl">
          <span className="text-base-100">Login to</span> <span className="text-base-content">{APP_NAME}</span>
        </span>
        <div className="form-control  gap-4 sm:gap-8">
          <label className="input-group-sm input-group rounded-xl sm:input-group-md">
            <span className="!rounded-l-xl bg-transparent text-xl text-primary-content sm:text-2xl">
              <MdEmail />
            </span>
            <input
              type="email"
              placeholder="Email..."
              className="input-bordered input input-md w-full !rounded-xl"
            />
          </label>
          <label className="input-group-sm input-group rounded-xl sm:input-group-md">
            <span className="!rounded-l-xl bg-transparent text-xl text-primary-content sm:text-2xl">
              <MdLock />
            </span>
            <input
              type="password"
              placeholder="Password..."
              className="input-bordered input input-md w-full !rounded-xl"
            />
          </label>
          <div className="inline-flex flex-wrap justify-end gap-4 sm:gap-8">
            {/* <button className="btn btn-link p-0 text-lg font-bold sm:text-xl">
              Create Account
            </button> */}

            <button className="btn btn-link p-0 text-lg font-bold text-primary-content sm:text-xl">
              Forget Password?
            </button>
          </div>
          <button className="btn btn-primary text-lg font-bold sm:text-lg">
            Login
          </button>

          <span className="mx-auto text-lg font-bold opacity-50 sm:text-xl">
            New to {APP_NAME}?
          </span>

          <button
            className="btn btn-primary flex-1 flex-nowrap gap-x-2
            text-clip text-lg font-bold sm:gap-x-4 sm:text-lg"
          >
            Register Now
          </button>

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
        </div>
      </div>
    </div>
  );
}

export default AuthPanel;
