import React from "react";
import { MdEmail, MdLock } from "react-icons/md";
import GradientBackground from "../main/GradientBackground";

function AuthPanel() {
  return (
    <div
      className="m-auto flex flex-col gap-4 sm:gap-8 p-4 sm:p-8 
      rounded-xl bg-base-300 ring-2 ring-base-content/20 shadow-xl
      w-full sm:max-w-sm md:max-w-md lg:max-w-lg relative z-0 overflow-hidden"
    >
      <GradientBackground />
      <span className="text-center text-2xl sm:text-3xl">Login</span>
      <div className="form-control  gap-4 sm:gap-8">
        <label className="input-group input-group-md sm:input-group-lg rounded-xl">
          <span className="text-2xl sm:text-3xl bg-primary text-primary-content !rounded-l-xl">
            <MdEmail />
          </span>
          <input
            type="email"
            placeholder="Email..."
            className="input input-bordered input-md sm:input-lg !rounded-r-xl w-full"
          />
        </label>
        <label className="input-group input-group-md sm:input-group-lg rounded-xl">
          <span className="text-2xl sm:text-3xl bg-primary text-primary-content !rounded-l-xl">
            <MdLock />
          </span>
          <input
            type="password"
            placeholder="Password..."
            className="input input-bordered input-md sm:input-lg !rounded-r-xl w-full"
          />
        </label>
        <div className="inline-flex justify-between gap-4 sm:gap-8">
          <button className="btn btn-link p-0 font-bold text-lg sm:text-xl">
            Create Account
          </button>

          <button className="btn btn-link p-0 font-bold text-lg sm:text-xl">
            Forget Password?
          </button>
        </div>
        <button className="btn btn-md sm:btn-lg btn-primary font-bold text-xl sm:text-2xl">
          Login
        </button>
      </div>
    </div>
  );
}

export default AuthPanel;
