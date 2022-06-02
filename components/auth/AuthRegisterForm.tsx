import React from "react";
import { MdEmail, MdLock } from "react-icons/md";
import { AuthFormProps } from "./AuthPanel";

function AuthRegisterForm({ changeForm }: AuthFormProps) {
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
      <button className="btn btn-primary text-lg font-bold sm:text-lg">
        Register
      </button>
      <span className="mx-auto text-lg font-bold opacity-50 sm:text-xl">
        Already have an account?
      </span>

      <button
        className="btn btn-primary flex-1 flex-nowrap gap-x-2
            text-clip text-lg font-bold sm:gap-x-4 sm:text-lg"
        onClick={() => changeForm("LOGIN")}
      >
        Login Instead
      </button>
    </>
  );
}

export default AuthRegisterForm;
