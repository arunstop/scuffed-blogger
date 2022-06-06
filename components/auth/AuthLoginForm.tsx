import React from "react";
import { MdEmail, MdLock } from "react-icons/md";
import { APP_NAME } from "../../utils/helpers/Constants";
import MainTextInput from "../input/MainTextInput";
import { AuthFormProps } from "./AuthPanel";

function AuthLoginForm({ changeForm }: AuthFormProps) {
  return (
    <>
      <MainTextInput type="email" placeholder="Email..." icon={<MdEmail />} />
      <MainTextInput
        type="password"
        placeholder="Password..."
        icon={<MdLock />}
        minLength={8}
      />
      <div className="inline-flex flex-wrap justify-end gap-4 sm:gap-8">
        {/* <button className="btn btn-link p-0 text-lg font-bold sm:text-xl">
    Create Account
  </button> */}

        <button
          className="btn btn-link p-0 text-lg font-bold text-primary-content sm:text-xl"
          onClick={() => changeForm("RESET_PW")}
          tabIndex={-1}
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
