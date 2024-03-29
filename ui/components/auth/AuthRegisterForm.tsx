import { FirebaseError } from "firebase/app";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  MdEmail,
  MdFormatColorText,
  MdOutlineVpnKey,
  MdVpnKey,
} from "react-icons/md";
import { useAuthCtx } from "../../../app/contexts/auth/AuthHook";
import { MainNetworkResponse, netLoading } from "../../../base/data/Main";
import { UserModel } from "../../../base/data/models/UserModel";
import { waitFor } from "../../../app/helpers/DelayHelpers";
import InputText from "../input/InputText";
import { StatusPlaceholderAction } from "../placeholder/StatusPlaceholder";
import { AuthFormProps } from "./AuthPanel";
import { fbUserAuthRegister } from "../../../app/services/UserService";

export interface RegisterFormFields {
  email: string;
  password: string;
  cPassword: string;
  name: string;
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
    getValues,
    formState: { errors },
  } = useForm<RegisterFormFields>({ mode: "onChange" });

  const { authAct } = useAuthCtx();

  function actionLoading(resp: MainNetworkResponse<string | null>) {
    if (!resp.data) return;
    setAction({
      newLoading: false,
      newNetResp: resp,
      newPlaceHolder: {
        title: resp.message,
        desc: resp.data,
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

  // Show error based on the error-code
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
    if (
      errorCode === "auth/email-already-in-use" ||
      errorCode === "permission-denied"
    ) {
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
        title: title || "Something weird happened",
        desc:
          `${desc ? desc + "\n" : ""}- - - -\n${resp.message}` || resp.message,
        status: "error",
        actions: actions,
      },
    });
  }

  // Show success
  function actionSuccess(resp: MainNetworkResponse<UserModel | null>) {
    setAction({
      newLoading: false,
      newNetResp: resp,
      newPlaceHolder: {
        title: "Registration completed!",
        desc: "Welcome to Tuturku! When thoughts meet each other.\n\
        Well that was smooth, wasn't it? Explore our articles or you can write your own.",
        status: "success",
        actions: [
          // {
          //   callback: () => cancelActions(false),
          //   label: "Explore",
          // },
          {
            callback: () => {
              router.push("/profile/setup");
            },
            label: "Continue",
          },
        ],
      },
    });
  }
  // console.log(watch("email"));

  const onSubmit: SubmitHandler<RegisterFormFields> = async (data) => {
    actionLoading(
      netLoading(
        "Processing your registration",
        "Hold up for a moment, we are registering your information into our database, checking things left right and center as usual, you know the drill",
      ),
    );
    await waitFor(2000);
    await fbUserAuthRegister({
      data: { fields: { ...data, email: data.email.toLowerCase() } },
      callback: async (resp) => {
        // if loading
        if (resp.status === "loading") {
          // cancelActions(true);
          return actionLoading(
            netLoading(
              "Adding your information into our database",
              "We have just authenticated you into our system. Now wait for a moment as we adding your complete information into our database.",
            ),
          );
        }
        // wait for a bit if it is not loading
        // else await waitFor(2000);
        // if error
        if (resp.status === "error")
          return actionError(resp as MainNetworkResponse<FirebaseError>, () =>
            onSubmit(data),
          );
        // if success
        if (resp.status === "success")
          return actionSuccess(resp as MainNetworkResponse<UserModel>);
      },
    }).then((e) => {
      authAct.setUser(e as UserModel);
    });
  };

  return (
    <form
      className="form-control  gap-2 sm:gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <InputText
        type="text"
        placeholder="Name"
        icon={<MdFormatColorText />}
        label="Name"
        {...register("name", {
          required: { value: true, message: "Name cannot be empty" },
          minLength: {
            value: 2,
            message: "Name requires min. 2 characters",
          },
          // pattern: {
          //   // value: /^(?:[\p{L}\p{Mn}\p{Pd}\\'\x{2019}]+[\p{L}\p{Mn}\p{Pd}\\'\x{2019}]+\s?)+$/gmis,
          //   value:/^[a-zA-Z ]$/,
          //   message: "Name can only contain letters",
          // },
          validate: {
            forbiddenCharNum: (value) =>
              /\d/.test(value) ? "Cannot contains numbers" : true,
          },
        })}
        error={!!errors.name}
        errorMsg={errors.name?.message}
      />

      <InputText
        type="email"
        placeholder="Email"
        icon={<MdEmail />}
        label="Email"
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
      <InputText
        type="password"
        placeholder="••••••••"
        icon={<MdOutlineVpnKey />}
        label="Password"
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
      <InputText
        type="password"
        placeholder="••••••••"
        icon={<MdVpnKey />}
        label="Confirm Password"
        {...register("cPassword", {
          required: { value: true, message: "Password cannot be empty" },
          minLength: {
            value: 8,
            message: "Password should be 8 characters minimum",
          },
          validate: {
            differentPassword: (value) =>
              value !== getValues().password
                ? "Passwords should be the same"
                : true,
          },
        })}
        error={!!errors.cPassword}
        errorMsg={errors.cPassword?.message}
      />

      <div className="flex flex-col gap-4 sm:gap-8">
        <button className="btn --btn-resp btn-primary text-lg font-bold sm:text-xl mt-4 sm:mt-8">
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
      </div>
    </form>
  );
}

export default AuthRegisterForm;
