import React from "react";
import { MdEmail } from "react-icons/md";
import { APP_NAME } from "../../utils/helpers/Constants";
import MainInput from "../input/MainInput";
import { AuthFormProps } from "./AuthPanel";

function AuthResetPwForm({ changeForm }: AuthFormProps) {
  return (
    <>
      <MainInput type="text" placeholder="Email..." icon={<MdEmail />} />

      <button className="btn btn-primary text-lg font-bold sm:text-xl">
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

export default AuthResetPwForm;
