import React from "react";
import { MdEmail, MdLock } from "react-icons/md";
import { APP_NAME } from "../../utils/helpers/Constants";
import { AuthFormProps } from "./AuthPanel";

function AuthLoginForm({ changeForm }: AuthFormProps) {
  return (
    <>
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

        <button
          className="btn btn-link p-0 text-lg font-bold text-primary-content sm:text-xl"
          onClick={() => changeForm("RESET_PW")}
        >
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
        onClick={() => changeForm("REGISTER")}
      >
        Register Now
      </button>
    </>
  );
}

export default AuthLoginForm;
