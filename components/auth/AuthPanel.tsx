import React, { useCallback, useState } from "react";
import { APP_NAME } from "../../utils/helpers/Constants";
import GradientBackground from "../main/GradientBackground";
import AuthLoginForm from "./AuthLoginForm";
import AuthRegisterForm from "./AuthRegisterForm";
import AuthResetPwForm from "./AuthResetPwForm";
import AuthSocialSection from "./AuthSocialSection";

export type AuthFormTypes = "LOGIN" | "REGISTER" | "RESET_PW";
export interface AuthFormProps {
  changeForm: (form: AuthFormTypes) => void;
}
function AuthPanel() {
  const [form, setForm] = useState<AuthFormTypes>("LOGIN");

  const changeForm = useCallback((form: AuthFormTypes) => {
    setForm(form);
  }, []);

  const renderTitle = () => {
    switch (form) {
      case "LOGIN":
        return (
          <>
            <span className="">Login to </span>
            <span className="text-base-content">{APP_NAME}</span>
          </>
        );
      case "REGISTER":
        return (
          <>
            <span className="">Create </span>
            <span className="text-base-content">{APP_NAME} </span>
            <span className="">account</span>
          </>
        );
      case "RESET_PW":
        return (
          <>
            <span className="">Reset Password</span>
          </>
        );
      default:
        break;
    }
  };

  const renderCurrentForm = () => {
    switch (form) {
      case "LOGIN":
        return <AuthLoginForm changeForm={changeForm} />;
      case "REGISTER":
        return <AuthRegisterForm changeForm={changeForm} />;
      case "RESET_PW":
        return <AuthResetPwForm changeForm={changeForm} />;
      default:
        break;
    }
  };

  return (
    <div className="relative z-0 overflow-hidden rounded-xl">
      <GradientBackground />

      <div className="mx-auto flex w-full flex-col gap-4 p-4 sm:max-w-md sm:gap-8 sm:p-8 md:max-w-lg lg:max-w-xl">
        <span className="my-1 text-center text-2xl font-black text-primary-content sm:my-3 sm:text-3xl">
          {renderTitle()}
        </span>
        <div className="form-control  gap-4 sm:gap-8">
          {renderCurrentForm()}
          <AuthSocialSection />
        </div>
      </div>
    </div>
  );
}

export default AuthPanel;
