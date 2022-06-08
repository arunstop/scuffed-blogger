import React from "react";
import { MdEmail, MdLock } from "react-icons/md";
import MainTextInput from "../input/MainTextInput";
import { AuthFormProps } from "./AuthPanel";

function AuthRegisterForm({ changeForm }: AuthFormProps) {
  return (
    <>
      <MainTextInput type="email" placeholder="Email..." icon={<MdEmail />} />
      <MainTextInput
        type="password"
        placeholder="Password..."
        icon={<MdLock />}
        minLength={8}
      />

      <button className="btn --btn-resp btn-primary text-lg font-bold sm:text-xl">
        Register
      </button>
      <span className="mx-auto font-bold opacity-50 sm:text-lg">
        Already have an account?
      </span>

      <button
        className="btn --btn-resp btn-primary flex-1 flex-nowrap gap-x-2
            text-clip text-lg font-bold sm:gap-x-4 sm:text-xl"
        onClick={() => changeForm("LOGIN")}
      >
        Login Instead
      </button>
    </>
  );
}

export default AuthRegisterForm;
