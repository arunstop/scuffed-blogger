import React from "react";
import { MdEmail } from "react-icons/md";
import { APP_NAME } from "../../app/helpers/Constants";
import InputText from "../input/InputText";
import { AuthFormProps } from "./AuthPanel";

function AuthResetPwForm({ changeForm }: AuthFormProps) {
  return (
    <>
      <InputText type="email" placeholder="Email..." icon={<MdEmail />} />
     

      <button className="btn --btn-resp btn-primary text-lg font-bold sm:text-xl">
        Login
      </button>
      <span className="mx-auto font-bold opacity-50 sm:text-lg">
        New to {APP_NAME}?
      </span>

      <button
        className="btn --btn-resp btn-primary flex-1 flex-nowrap gap-x-2
            text-clip text-lg font-bold sm:gap-x-4 sm:text-lg"
        onClick={() => changeForm("REGISTER")}
      >
        Register Now
      </button>
    </>
  );
}

export default AuthResetPwForm;
