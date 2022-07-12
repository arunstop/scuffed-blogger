import { FirebaseError } from "firebase/app";
import { useRouter } from "next/router";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdEmail, MdVpnKey } from "react-icons/md";
import { useAuthCtx } from "../../utils/contexts/auth/AuthHook";
import { MainNetworkResponse } from "../../utils/data/Main";
import { UserModel } from "../../utils/data/models/UserModel";
import { APP_NAME } from "../../utils/helpers/Constants";
import { waitFor } from "../../utils/helpers/DelayHelpers";
import { firebaseApi } from "../../utils/services/network/FirestoreApi";
import MainTextInput from "../input/MainTextInput";
import { StatusPlaceholderAction } from "../placeholder/StatusPlaceholder";
import { AuthFormProps } from "./AuthPanel";

export interface LoginFields {
  email: string;
  password: string;
}

function AuthRegisterForm({
  changeForm,
  setAction,
  cancelActions,
}: AuthFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<LoginFields>({ mode: "onChange" });

  const { authAct } = useAuthCtx();

  function actionLoading(title = "", desc = "") {
    setAction({
      newLoading: true,
      newPlaceHolder: {
        title: title || "Processing your authentication...",
        desc:
          desc ||
          `Hold up a little bit, we are checking whether your credential matched any data in our database. This will be quick.`,
        status: "loading",
        actions: [
          {
            callback: () => cancelActions(false),
            label: "Cancel",
          },
        ],
      },
      // newNetResp:netCreateLoadingResponse(""),
    });
  }

  function actionError(
    resp: MainNetworkResponse<FirebaseError>,
    tryAgain: () => void,
  ) {
    let title, desc;
    const actions: StatusPlaceholderAction[] = [
      {
        callback: () => cancelActions(false),
        label: "Back",
      },
    ];
    const errorCode = resp.data.code;
    if (errorCode === "auth/user-not-found") {
      title = "User not found";
      desc = `Sorry we couldn't authenticate you in, because the credential that you used is invalid. Please enter the correct email and password combination`;
      reset();
      actions.push({
        callback: () => {
          cancelActions(false);
          changeForm("REGISTER");
        },
        label: "Register instead",
      });
    } else if (errorCode === "auth/wrong-password") {
      title = "Invalid password";
      desc =
        `Sorry we have to deny your authentication attempt because you just used a wrong password for the matching email. Please use the matching email and password. ` +
        `Alternatively you can reset your password if you forget it`;
      actions.push({
        callback: () => {
          cancelActions(false);
          changeForm("RESET_PW");
        },
        label: "Reset my password",
      });
      setError("password", {
        message: "Invalid password for the matching email",
      });
    } else if (errorCode === "auth/network-request-failed") {
      title = "Failed to connect to the server";
      desc = `There is no internet connection to connect you to our server. Please ensure that you have an active internet connection, or maybe your connection speed is too low.`;
      actions.push({
        callback: tryAgain,
        label: "Try again",
      });
    }

    setAction({
      newLoading: false,
      newNetResp: resp,
      newPlaceHolder: {
        title: title || "Something weird happened...",
        desc:
          `${desc ? desc + "\n" : ""}- - - -\n${resp.data.message}` ||
          resp.message,
        status: "error",
        actions: actions,
      },
    });
  }

  function actionSuccess(resp: MainNetworkResponse<UserModel>) {
    setAction({
      newLoading: false,
      newNetResp: resp,
      newPlaceHolder: {
        title: "Sign in completed!",
        desc: "Welcome back! Fancy seeing you here again. Wonder what you are up to this time. Redirecting you to the main page....",
        status: "success",
        actions: [
          // {
          //   callback: () => cancelActions(false),
          //   label: "Explore",
          // },
          {
            callback: () => router.push("/"),
            label: "Continue",
          },
        ],
      },
    });
  }
  // console.log(watch("email"));

  const onSubmit: SubmitHandler<LoginFields> = async (data) => {
    actionLoading();
    await firebaseApi
      .authLoginUser({
        fields: data,
        callback: async (resp) => {
          // if loading
          if (resp.status === "loading") {
            // cancelActions(true);
            return actionLoading(
              "Retrieving your data from our database",
              "The credential you entered matched a record in our database. Hold up for a bit ase we are retrieving the data for you.",
            );
          }
          await waitFor(1000);
          // if error
          if (resp.status === "error")
            return actionError(resp as MainNetworkResponse<FirebaseError>, () =>
              onSubmit(data),
            );
          // if success
          if (resp.status === "success") {
            const respUser = resp as MainNetworkResponse<UserModel>;
            actionSuccess(respUser);
          }
        },
      })
      .then((e) => {
        authAct.setUser(e as UserModel);
      });
  };

  return (
    <form
      className="form-control  gap-4 sm:gap-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <MainTextInput
        type="email"
        placeholder="Email..."
        icon={<MdEmail />}
        {...register("email", {
          required: { value: true, message: "Email cannot be empty" },
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,64}$/,
            message: "Email requires a valid format",
          },
        })}
        error={!!errors.email}
        errorMsg={errors.email?.message}
      />
      <MainTextInput
        type="password"
        placeholder="Password..."
        icon={<MdVpnKey />}
        {...register("password", {
          required: { value: true, message: "Password cannot be empty" },
          minLength: {
            value: 8,
            message: "Password should be 8 characters minimum",
          },
        })}
        error={!!errors.password}
        errorMsg={errors.password?.message}
      />

      <div className="inline-flex flex-wrap justify-end gap-4 sm:gap-8">
        {/* <button className="btn --btn-resp btn-link p-0 font-bold">
    Create Account
  </button> */}

        <span
          className="btn --btn-resp btn-link p-0 font-bold text-primary-content !text-base sm:!text-lg"
          onClick={() => changeForm("RESET_PW")}
          tabIndex={-1}
        >
          Forget Password?
        </span>
      </div>
      <button className="btn --btn-resp btn-primary font-bold" type="submit">
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
    </form>
  );
}

export default AuthRegisterForm;
