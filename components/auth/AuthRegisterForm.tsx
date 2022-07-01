import { FirebaseError } from "firebase/app";
import { User } from "firebase/auth";
import { useRouter } from "next/router";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdEmail, MdLock } from "react-icons/md";
import { MainNetworkResponse } from "../../utils/data/Main";
import { waitFor } from "../../utils/helpers/DelayHelpers";
import { firebaseApi } from "../../utils/services/network/FirestoreApi";
import MainTextInput from "../input/MainTextInput";
import { StatusPlaceholderAction } from "../placeholder/StatusPlaceholder";
import { AuthFormProps } from "./AuthPanel";

export interface RegisterFields {
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
    formState: { errors },
  } = useForm<RegisterFields>({ mode: "onChange" });

  function actionLoading() {
    setAction({
      newLoading: true,
      newPlaceHolder: {
        title: "Processing your registration...",
        desc: "Hold up for a moment, we are registering your information into our database, checking things left right and center as usual, you know the drill",
        status: "loading",
        actions: [
          {
            callback: () => cancelActions(true),
            label: "Cancel",
          },
        ],
      },
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
    if (errorCode === "auth/email-already-in-use") {
      title = "User already exists";
      desc = `The email that you just used is already recorded in our database, if you are the owner of this account please login instead, if not try to use another credential.`;
      actions.push({
        callback: () => {
          cancelActions(false);
          changeForm("LOGIN");
        },
        label: "Login instead",
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
          `${desc ? desc + "\n" : ""}- - - -\n${resp.message}` || resp.message,
        status: "error",
        actions: actions,
      },
    });
  }

  function actionSuccess(resp: MainNetworkResponse<User | null>) {
    setAction({
      newLoading: false,
      newNetResp: resp,
      newPlaceHolder: {
        title: "Registration completed!",
        desc: "Welcome to Tuturku! When thoughts meet each other.\n\
        Well that was smooth, wasn't it? Explore our articles or you can write your own.",
        status: "success",
        actions: [
          {
            callback: () => cancelActions(false),
            label: "Explore",
          },
          {
            callback: () => {
              router.push("/write");
            },
            label: "Write my first article",
          },
        ],
      },
    });
  }
  // console.log(watch("email"));

  const onSubmit: SubmitHandler<RegisterFields> = async (data) => {
    actionLoading();
    await waitFor(1000);
    await firebaseApi
      .authRegisterUser({
        fields: data,
        callback: (resp) => {
          // if error
          if (resp.status === "error")
            return actionError(resp as MainNetworkResponse<FirebaseError>, () =>
              onSubmit(data),
            );
          // if success
          if (resp.status === "success")
            return actionSuccess(resp as MainNetworkResponse<User>);
        },
      })
      .then((e) => {
        console.log(e);
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
            value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
            message: "Email requires a valid format",
          },
        })}
        error={!!errors.email}
        errorMsg={errors.email?.message}
      />
      <MainTextInput
        type="password"
        placeholder="Password..."
        icon={<MdLock />}
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

      <button className="btn --btn-resp btn-primary text-lg font-bold sm:text-xl">
        Register
      </button>
      <span className="mx-auto font-bold opacity-50 sm:text-lg">
        Already have an account?
      </span>

      <button
        type="submit"
        className="btn --btn-resp btn-primary flex-1 flex-nowrap gap-x-2
            text-clip text-lg font-bold sm:gap-x-4 sm:text-xl"
        onClick={() => changeForm("LOGIN")}
      >
        Login Instead
      </button>
    </form>
  );
}

export default AuthRegisterForm;
