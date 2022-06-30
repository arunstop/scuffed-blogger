import { User } from "firebase/auth";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdEmail, MdLock } from "react-icons/md";
import { MainNetworkResponse } from "../../utils/data/Main";
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
        desc: `Hold up for a moment, we are registering your information into our database, 
          checking things left right and center as usual, you know the drill`,
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
        title: "Something weird happened...",
        desc: `Sorry that this happened. But an error has occured, stating: ${resp.message}`,
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
    // await waitFor(5000);
    await firebaseApi
      .registerUser({
        fields: data,
        callback: (resp) => {
          // if error
          if (resp.status === "error")
            return actionError(resp, () => onSubmit(data));
          // if success
          if (resp.status === "success") return actionSuccess(resp);
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
