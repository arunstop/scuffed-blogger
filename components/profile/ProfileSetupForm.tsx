import { Transition } from "@headlessui/react";
import { FirebaseError } from "firebase/app";
import React, { Fragment } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  MdAdd,
  MdAlternateEmail,
  MdEdit,
  MdNotes,
  MdPerson,
} from "react-icons/md";
import { waitFor } from "../../utils/helpers/DelayHelpers";
import { transitionPullV } from "../../utils/helpers/UiTransitionHelpers";
import { useNetworkAction } from "../../utils/hooks/NetworkActionHook";
import { scrollToTop } from "../../utils/hooks/RouteChangeHook";
import { firebaseApi } from "../../utils/services/network/FirestoreApi";
import MainTextAreaInput from "../input/MainTextAreaInput";
import MainTextInput from "../input/MainTextInput";
import GradientBackground from "../main/GradientBackground";
import StatusPlaceholder, {
  StatusPlaceholderProps,
} from "../placeholder/StatusPlaceholder";

export interface SetupProfileFormFields {
  username: string;
  avatar: FileList;
  bio: string;
  desc: string;
}

// function imgPreviewStyleHelper(empty: boolean, error: boolean) {
//   if (empty) {
//     return "border-dashed border-base-content hover:border-base-content/100";
//   } else {
//     return error
//       ? "border-dashed border-error"
//       : "border-solid border-base-content";
//   }
// }

function ProfileSetupForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    resetField,
    watch,
    control,
    clearErrors,
    setError,
  } = useForm<SetupProfileFormFields>({ mode: "onChange" });
  const avatar = watch("avatar")?.[0];
  const {
    loading,
    isError,
    isLoading,
    setLoading,
    setNetResp,
    stopLoading,
    clearResp,
    hasLoaded,
    netResp,
  } = useNetworkAction<
    StatusPlaceholderProps | null,
    StatusPlaceholderProps | null
  >({ value: false, data: null });
  // const [loading, setLoading] = useState(false);
  // const [error1, setError1] = useState(false);
  // const [success, setSuccess] = useState(false);

  const onSubmit: SubmitHandler<SetupProfileFormFields> = async (data) => {
    clearResp();
    setLoading({
      value: true,
      data: {
        status: "loading",
        title: "Processing your data",
        desc: "Loding to execute your action",
        actions: [
          {
            label: "Cancel",
            callback: () => {
              stopLoading();
            },
          },
        ],
      },
    });
    console.log(loading);

    // setLoading(true);

    scrollToTop(true);
    await firebaseApi.updateProfile({
      fields: data,
      callback: async (resp) => {
        scrollToTop(true);
        await waitFor(1000);
        // if (resp.status !== "loading") setLoading({ value: false, data: null });
        // setLoading((prev) => {
        //   return { value: false, data: prev.data };
        // });
        // setLoading(false);

        if (resp.status === "error") {
          const progress = resp.data as FirebaseError;
          console.log(progress);
          stopLoading();
          setNetResp({
            ...resp,
            data: {
              title: "Oops something happened.",
              desc: progress.message,
              status: "error",
              actions: [
                {
                  label: "Cancel",
                  callback: () => {
                    setLoading({ value: false, data: null });
                  },
                },
              ],
            },
          });
          // setError1(true);
        }
        if (resp.status === "success") {
          // const progress = resp.data as UserModel;
          // console.log(`Upload file successful : ${progress}`);
          // setSuccess(true);
          setNetResp({
            ...resp,
            data: {
              title: "Registration completed!",
              desc: "Welcome to Tuturku! When thoughts meet each other.\n\
            Well that was smooth, wasn't it? Explore our articles or you can write your own.",
              status: "success",
              actions: [
                {
                  label: "Cancel",
                  callback: () => {
                    setLoading({ value: false, data: null });
                  },
                },
              ],
            },
          });
        }
      },
    });
  };

  return (
    <>
      <Transition
        show={!isLoading && !loading.data}
        enter="transition-opacity duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-500"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <GradientBackground />
      </Transition>

      <div className="min-h-screen mx-auto flex w-full flex-col p-4 relative">
        <span className="my-1 text-center text-2xl font-black text-primary-content sm:my-3 sm:text-3xl p-4 pb-0 relative">
          Setup your profile
        </span>
        <div className="flex flex-col w-full relative">
          <div className="absolute flex flex-col w-full z-10">
            <Transition
              appear
              show={isLoading && !hasLoaded}
              as={"div"}
              className={"absolute inset-x-0"}
              {...transitionPullV({
                enter: " w-full",
                entered: "",
                leave: " w-full",
              })}
            >
              <StatusPlaceholder
                {...(loading.data as StatusPlaceholderProps)}
              />
            </Transition>

            <Transition
              appear
              show={
                !loading.value && netResp?.status === "error" && !!loading.data
              }
              as={"div"}
              className={"absolute inset-x-0"}
              {...transitionPullV({
                enter: " w-full",
                entered: "",
                leave: " w-full",
              })}
            >
              {netResp && (
                <StatusPlaceholder
                  {...(netResp?.data as StatusPlaceholderProps)}
                />
              )}
            </Transition>

            {/*<Transition
              appear
              show={success}
              as={"div"}
              className={"absolute inset-x-0"}
              {...transitionPullV({
                enter: " w-full",
                entered: "",
                leave: " w-full",
              })}
            >
              <StatusPlaceholder
                status="success"
                title="Success"
                desc={LOREM}
                actions={[
                  {
                    label: "Cancel",
                    callback: () => {
                      setSuccess(false);
                    },
                  },
                ]}
              />
            </Transition> */}
          </div>

          <Transition
            appear
            show={!isLoading && !loading.data}
            as={Fragment}
            {...transitionPullV({
              enter: "w-full",
              entered: "w-full",
              leave: "w-full",
            })}
          >
            <form
              className="form-control mx-auto flex w-full flex-col gap-4 p-4 sm:max-w-md sm:gap-8 
      sm:p-8 md:max-w-lg lg:max-w-xl"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex flex-col items-center">
                <label
                  className="pointer-events-none flex flex-col items-center 
          [&>*]:pointer-events-auto"
                >
                  <span
                    className={`group relative h-36 w-36 transform cursor-pointer overflow-hidden rounded-[50%]
            border-2   transition-[border-radius] duration-300
            hover:rounded-xl  sm:h-48
            sm:w-48 sm:border-4 md:h-60 md:w-60 lg:h-72 lg:w-72
            ${
              errors.avatar
                ? "border-dashed border-error"
                : !avatar
                ? "border-dashed border-base-content/20 hover:border-base-content/100"
                : "border-solid border-base-content"
            }
            `}
                  >
                    <img
                      className="h-full w-full max-w-none object-cover transition-transform duration-300 group-hover:scale-125"
                      src={
                        avatar
                          ? URL.createObjectURL(avatar)
                          : "https://picsum.photos/seed/picsum/300/300"
                      }
                    />
                    <div
                      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/0 
              opacity-0 transition-[opacity,background-color] duration-500 
              group-hover:bg-black/60 group-hover:opacity-100"
                    >
                      {avatar ? (
                        <MdEdit className="text-4xl text-white sm:text-5xl" />
                      ) : (
                        <MdAdd className="text-4xl text-white sm:text-5xl" />
                      )}
                    </div>
                  </span>
                  <span
                    className={`--btn-resp btn btn-link p-0 !text-base font-bold sm:!text-lg ${
                      errors.avatar ? "text-error" : "text-base-content"
                    }`}
                    tabIndex={-1}
                  >
                    {errors.avatar
                      ? errors.avatar.message
                      : avatar
                      ? "Change the profile picture"
                      : "Add a profile picture"}
                  </span>
                  <Controller
                    render={({
                      formState,
                      field: { ref, name, onChange, onBlur },
                    }) => (
                      <input
                        id="input-avatar"
                        type={"file"}
                        className="hidden"
                        accept="image/png, image/gif, image/jpeg"
                        // onChange={(event) => {
                        //   props.
                        // }}
                        ref={ref}
                        name={name}
                        onBlur={onBlur}
                        onChange={(ev) => {
                          const files = ev.target.files;
                          if (!files?.length) return;
                          const file = files[0];
                          const validImgTypes = [
                            "image/png",
                            "image/gif",
                            "image/jpeg",
                          ];
                          if (!validImgTypes.includes(file.type)) {
                            // resetField("avatar");
                            return setError("avatar", {
                              type: "forbiddenFileType",
                              message: "Invalid image file type",
                            });
                          }

                          if (file.size > 2e6) {
                            // resetField("avatar");
                            return setError("avatar", {
                              type: "exceededFileSize",
                              message: "File cannot be more than 2MB",
                            });
                          }

                          onChange(ev.target.files);
                        }}
                      />
                    )}
                    control={control}
                    name="avatar"
                  />
                </label>
                {/* States component for `avatar` field */}
                {/* If no errors and not empty */}
                {!errors.avatar && avatar && (
                  <span
                    className="--btn-resp btn-outline btn"
                    onClick={() => {
                      resetField("avatar");
                    }}
                    tabIndex={-1}
                  >
                    Cancel
                  </span>
                )}
                {/* If error */}
                {errors.avatar &&
                  (avatar ? (
                    <div className="flex flex-wrap gap-2">
                      <span
                        className="--btn-resp btn-outline btn"
                        onClick={() => {
                          document.getElementById("input-avatar")?.click();
                        }}
                        tabIndex={-1}
                      >
                        Change
                      </span>
                      <span
                        className="--btn-resp btn-outline btn"
                        onClick={() => {
                          clearErrors("avatar");
                        }}
                        tabIndex={-1}
                      >
                        Undo
                      </span>
                    </div>
                  ) : (
                    <span
                      className="--btn-resp btn-outline btn"
                      onClick={() => {
                        resetField("avatar");
                      }}
                      tabIndex={-1}
                    >
                      Cancel
                    </span>
                  ))}
              </div>
              <MainTextInput
                type="text"
                placeholder="Username"
                icon={<MdAlternateEmail />}
                {...register("username", {
                  required: {
                    value: true,
                    message: "Username cannot be empty",
                  },
                  minLength: {
                    value: 4,
                    message:
                      "Username requires must be between 4 - 24 characters",
                  },
                  maxLength: {
                    value: 24,
                    message:
                      "Username requires must be between 4 - 24 characters",
                  },
                  pattern: {
                    // value: /^(?:[\p{L}\p{Mn}\p{Pd}\\'\x{2019}]+[\p{L}\p{Mn}\p{Pd}\\'\x{2019}]+\s?)+$/gmis,
                    value: /^[a-zA-Z0-9_]+$/i,
                    message:
                      "Username requires only letters, numbers and underscores",
                  },
                })}
                error={!!errors.username}
                errorMsg={errors.username?.message}
              />

              <MainTextInput
                type="text"
                placeholder="Short bio"
                icon={<MdPerson />}
                {...register("bio", {
                  required: { value: true, message: "Bio cannot be empty" },
                  minLength: {
                    value: 10,
                    message:
                      "Username requires must be between 10 - 100 characters",
                  },
                  maxLength: {
                    value: 100,
                    message:
                      "Username requires must be between 10 - 100 characters",
                  },
                })}
                error={!!errors.bio}
                errorMsg={errors.bio?.message}
              />
              <MainTextInput
                type="text"
                placeholder="About me"
                icon={<MdNotes />}
                {...register("desc", {
                  // required: { value: true, message: "Password cannot be empty" },
                  maxLength: {
                    value: 750,
                    message: "Password should be 8 characters minimum",
                  },
                })}
                error={!!errors.desc}
                errorMsg={errors.desc?.message}
              />

              <MainTextAreaInput className="min-h-[24rem] indent-8" />

              <button className="--btn-resp btn btn-primary text-lg font-bold sm:text-xl">
                Register
              </button>
              <span
                className="--btn-resp btn btn-link p-0 !text-base font-bold text-primary-content sm:!text-lg"
                onClick={() => {}}
                tabIndex={-1}
              >
                Maybe later
              </span>
            </form>
          </Transition>
        </div>
      </div>
    </>
  );
}

export default ProfileSetupForm;
