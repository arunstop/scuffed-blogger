import React, { useCallback, useState } from "react";
import { MainNetworkResponse } from "../../utils/data/Main";
import { APP_NAME } from "../../utils/helpers/Constants";
import { useNetworkAction } from "../../utils/hooks/NetworkActionHook";
import { scrollToTop } from "../../utils/hooks/RouteChangeHook";
import GradientBackground from "../main/GradientBackground";
import StatusPlaceholder, {
  StatusPlaceholderProps,
} from "../placeholder/StatusPlaceholder";
import AuthLoginForm from "./AuthLoginForm";
import AuthRegisterForm from "./AuthRegisterForm";
import AuthResetPwForm from "./AuthResetPwForm";
import AuthSocialSection from "./AuthSocialSection";

export type AuthFormTypes = "LOGIN" | "REGISTER" | "RESET_PW";
interface SetStatusPropsProps {
  newLoading: boolean;
  newPlaceHolder: StatusPlaceholderProps;
  newNetResp?: MainNetworkResponse<string | null>;
}
export interface AuthFormProps {
  changeForm: (form: AuthFormTypes) => void;
  setAction: ({
    newLoading,
    newPlaceHolder,
    newNetResp,
  }: SetStatusPropsProps) => void;
  cancelActions: () => void;
}
function AuthPanel() {
  const [form, setForm] = useState<AuthFormTypes>("LOGIN");
  const [placeholder, setPlaceholder] = useState<StatusPlaceholderProps>();
  const { loading, setLoading, netResp, setNetResp } = useNetworkAction<
    string | null
  >();

  const changeForm = useCallback((selectedForm: AuthFormTypes) => {
    scrollToTop(true);
    setForm(selectedForm);
  }, []);

  const setAction = useCallback(
    ({ newLoading, newPlaceHolder, newNetResp }: SetStatusPropsProps) => {
      setLoading(newLoading);
      setPlaceholder(newPlaceHolder);
      if (newNetResp) setNetResp(newNetResp);
    },
    [placeholder],
  );

  const cancelActions = useCallback(() => {
    setLoading(false);
    setPlaceholder(undefined);
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
            <span className="">Create a </span>
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
  return (
    <div className="relative z-0 overflow-hidden rounded-xl min-h-screen">
      {!loading && !placeholder && <GradientBackground />}
      <div className="mx-auto flex w-full flex-col gap-4 p-4 sm:max-w-md sm:gap-8 sm:p-8 md:max-w-lg lg:max-w-xl">
        <span className="my-1 text-center text-2xl font-black text-primary-content sm:my-3 sm:text-3xl">
          {renderTitle()}
        </span>

        {loading && placeholder && <StatusPlaceholder {...placeholder} />}
        {!loading && netResp?.status === "error" && placeholder && (
          <StatusPlaceholder {...placeholder} />
        )}
        {!loading && netResp?.status === "success" && placeholder && (
          <StatusPlaceholder {...placeholder} />
        )}
        {!loading && !placeholder && (
          <div className="form-control  gap-4 sm:gap-8">
            {form === "LOGIN" && (
              <AuthLoginForm
                setAction={setAction}
                changeForm={changeForm}
                cancelActions={cancelActions}
              />
            )}
            {form === "REGISTER" && (
              <AuthRegisterForm
                setAction={setAction}
                changeForm={changeForm}
                cancelActions={cancelActions}
              />
            )}
            {form === "RESET_PW" && (
              <AuthResetPwForm
                setAction={setAction}
                changeForm={changeForm}
                cancelActions={cancelActions}
              />
            )}
            <AuthSocialSection />
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthPanel;
