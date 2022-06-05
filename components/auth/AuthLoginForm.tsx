import React from "react";
import { MdEmail, MdLock } from "react-icons/md";
import { APP_NAME } from "../../utils/helpers/Constants";
import MainInput from "../input/MainInput";
import { AuthFormProps } from "./AuthPanel";

function AuthLoginForm({ changeForm }: AuthFormProps) {
  return (
    <>
      <MainInput type="text" placeholder="Email..." icon={<MdEmail />} />
      <MainInput type="password" placeholder="Password..." icon={<MdLock />} />
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
      <button className="btn btn-primary text-lg font-bold sm:text-xl">
        Login
      </button>
      <span className="mx-auto text-lg font-bold opacity-50 sm:text-xl">
        New to {APP_NAME}?
      </span>

      <button
        className="btn btn-primary flex-1 flex-nowrap gap-x-2
            text-clip text-lg font-bold sm:text-xl sm:gap-x-4"
        onClick={() => changeForm("REGISTER")}
      >
        Register Now
      </button>
    </>
  );
}

export default AuthLoginForm;
