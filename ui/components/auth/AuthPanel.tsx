import { Transition } from "@headlessui/react";
import { FirebaseError } from "firebase/app";
import React, { Fragment, useCallback, useState } from "react";
import { useAuthCtx } from "../../../app/contexts/auth/AuthHook";
import { MainNetworkResponse } from "../../../base/data/Main";
import { UserModel } from "../../../base/data/models/UserModel";
import { APP_NAME } from "../../../app/helpers/Constants";
import { transitionPullV } from "../../../app/helpers/UiTransitionHelpers";
import { useNetworkAction } from "../../../app/hooks/NetworkActionHook";
import { scrollToTop } from "../../../app/hooks/RouteChangeHook";
import GradientBackground from "../utils/GradientBackground";
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
  newNetResp?: MainNetworkResponse<UserModel | FirebaseError | string|null>;
}

const renderTitle = (form:string) => {
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

export interface AuthFormProps {
  changeForm: (form: AuthFormTypes) => void;
  setAction: ({
    newLoading,
    newPlaceHolder,
    newNetResp,
  }: SetStatusPropsProps) => void;
  cancelActions: (onlyLoading: boolean) => void;
}
function AuthPanel() {
  const [form, setForm] = useState<AuthFormTypes>("LOGIN");
  const { isLoggedIn } = useAuthCtx();
  // const [loading, setPlaceholder] = useState<StatusPlaceholderProps>();
  const { loading, setLoading, netResp, setNetResp } = useNetworkAction<
    StatusPlaceholderProps | null,
    StatusPlaceholderProps | null
  >({ value: false, data: null });

  const changeForm = useCallback((selectedForm: AuthFormTypes) => {
    scrollToTop(true);
    setForm(selectedForm);
  }, []);

  const setAction = useCallback(
    ({ newLoading, newPlaceHolder, newNetResp }: SetStatusPropsProps) => {
      scrollToTop(true);
      // setLoading((prev) => {
      //   return {
      //     value: newLoading,
      //     data: newLoading ? newPlaceHolder : prev.data,
      //   };
      // });
      // if (newLoading) setPlaceholder(newPlaceHolder);
      if (newNetResp) setNetResp({ ...newNetResp, data: newPlaceHolder });
    },
    [],
  );

  const cancelActions = useCallback((onlyLoading: boolean) => {
    scrollToTop(true);
    // setLoading({ value: false, data: null });
    setNetResp(undefined);
    // if (!onlyLoading) setPlaceholder(undefined);
  }, []);

  
  return (
    <div className="relative z-0 min-h-screen overflow-hidden rounded-xl">
      <Transition
        show={!netResp}
        enter="transition-opacity duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-500"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <GradientBackground />
      </Transition>

      <div className=" min-h-full mx-auto flex w-full flex-col p-4 sm:max-w-md sm:p-8 md:max-w-lg lg:max-w-xl">
        <span className="my-1 text-center text-2xl font-black text-primary-content sm:my-3 sm:text-3xl">
          {renderTitle(form)}
          {/* {(placeholder?.status||"")} */}
        </span>
        
          <div className={"flex w-full"}>
          {netResp ? <StatusPlaceholder {...netResp.data!} /> : <></>}
          </div>
        

        {/* <Transition
          appear
          show={!loading.value && netResp?.status === "error" && !!loading.data}
          as={Fragment}
          {...transitionPullV({
            enter: "absolute inset-x-0 w-full",
            entered: "absolute inset-x-0",
            leave: "absolute inset-x-0 w-full",
          })}
        >
          {netResp && <StatusPlaceholder {...netResp.data!} />}
        </Transition>

        <Transition
          appear
          show={
            !loading.value && netResp?.status === "success" && !!loading.data
          }
          as={Fragment}
          {...transitionPullV({
            enter: "absolute inset-x-0 w-full",
            entered: "absolute inset-x-0",
            leave: "absolute inset-x-0 w-full",
          })}
        >
          {netResp && <StatusPlaceholder {...netResp.data!} />}
        </Transition> */}

        <Transition
          appear
          show={!netResp}
          as={"div"}
          {...transitionPullV({
            // enter: " w-full",
            // entered: "",
            // leave: " w-full",
          })}
          unmount={false}
        >
          <div className="form-control mt-4 sm:mt-8 gap-4 sm:gap-8">
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
        </Transition>
      </div>
    </div>
  );
}

export default AuthPanel;
