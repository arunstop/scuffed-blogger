import React from "react";
import { MdEmail, MdLock } from "react-icons/md";
import MainTextInput from "../input/MainTextInput";
import { AuthFormProps } from "./AuthPanel";
import { useForm, SubmitHandler } from "react-hook-form";
import { waitFor } from "../../utils/helpers/DelayHelpers";
import { createErrorResponse } from "../../utils/data/Main";

interface InputFields {
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
  } = useForm<InputFields>({ mode: "onChange" });

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
            callback: cancelActions,
            label: "Cancel",
          },
        ],
      },
    });
  }

  function actionError(data: InputFields) {
    setAction({
      newLoading: false,
      newNetResp: createErrorResponse("Well something happened..."),
      newPlaceHolder: {
        title: "Something weird happened...",
        desc: `Sorry that this happened. But an error has occured, stating:\nError, something something something`,
        status: "error",
        actions: [
          {
            callback: cancelActions,
            label: "Cancel",
          },
          {
            callback: () => onSubmit(data),
            label: "Try again",
          },
          {
            callback: actionSuccess,
            label: "Not really",
          },
        ],
      },
    });
  }

  function actionSuccess() {
    setAction({
      newLoading: true,
      newPlaceHolder: {
        title: "Registration completed!",
        desc: `Welcome to Tuturku! When thoughts meet each other. Well that was smooth, wasn't it? 
        Explore our articles or you can write your own.`,
        status: "success",
        actions: [
          {
            callback: cancelActions,
            label: "Explore",
          },
          {
            callback: cancelActions,
            label: "Write my first article",
          },
        ],
      },
    });
  }
  // console.log(watch("email"));

  const onSubmit: SubmitHandler<InputFields> = async (data) => {
    actionLoading();
    await waitFor(3000);
    actionError(data);
  };
  // const confirm = (ev: React.FormEvent<HTMLFormElement>) => {
  //   ev.preventDefault();
  //   alert("sd");
  // };

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
