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
        {/* <button className="btn --btn-resp btn-link p-0 font-bold">
    Create Account
  </button> */}

        <button
          className="btn --btn-resp btn-link p-0 font-bold text-primary-content !text-base sm:!text-lg"
          onClick={() => changeForm("RESET_PW")}
          tabIndex={-1}
        >
          Forget Password?
        </button>
      </div>
      <button className="btn --btn-resp btn-primary font-bold">
        Login
      </button>
      <span className="mx-auto font-bold opacity-50 sm:text-lg">
        New to {APP_NAME}?
      </span>

      <button
        className="btn --btn-resp btn-primary flex-1 flex-nowrap gap-x-2
        text-clip font-bold sm:gap-x-4"
        onClick={() => changeForm("REGISTER")}
      >
        Register Now
      </button>
    </>
  );
}

export default AuthLoginForm;
