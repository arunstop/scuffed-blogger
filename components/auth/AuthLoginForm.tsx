import { User } from "firebase/auth";
import { useRouter } from "next/router";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdEmail, MdLock } from "react-icons/md";
import { MainNetworkResponse } from "../../utils/data/Main";
import { APP_NAME } from "../../utils/helpers/Constants";
import { waitFor } from "../../utils/helpers/DelayHelpers";
import { firebaseClient } from "../../utils/services/network/FirebaseClient";
import { firebaseApi } from "../../utils/services/network/FirestoreApi";
import MainTextInput from "../input/MainTextInput";
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
        title: "Signing you in...",
        desc: `Hold on tight! You will proceed once we made sure that your credential matches any record in our database.`,
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
    resp: MainNetworkResponse<User | null>,
    tryAgain: () => void,
  ) {
    setAction({
      newLoading: false,
      newNetResp: resp,
      newPlaceHolder: {
        title: "Invalid credential",
        desc: `Sorry we couldn't proceed you in, because the credential that you used is invalid, stating: ${resp.message}`,
        status: "error",
        actions: [
          {
            callback: () => cancelActions(false),
            label: "Cancel",
          },
          {
            callback: tryAgain,
            label: "Try again",
          },
        ],
      },
    });
  }

  function actionSuccess(resp: MainNetworkResponse<User | null>) {
    setAction({
      newLoading: false,
      newNetResp: resp,
      newPlaceHolder: {
        title: "Sign in completed!",
        desc: "Welcome back! Fancy seeing you here again. Wonder what you are up to this time. Reading more articles would be nice, or maybe you want write them instead?",
        status: "success",
        actions: [
          {
            callback: () => cancelActions(false),
            label: "Explore",
          },
          {
            callback: () => cancelActions(false),
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
      .signInUser({
        fields: data,
        callback: (resp) => {
          // if error
          if (resp.status === "error")
            return actionError(resp, () => onSubmit(data));
          // if success
          if (resp.status === "success") {
            actionSuccess(resp);
            router.push("/write");
          }
        },
      })
      .then((e) => {
        console.log(e);
      });
  };

  console.log(firebaseClient.auth.currentUser);

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
