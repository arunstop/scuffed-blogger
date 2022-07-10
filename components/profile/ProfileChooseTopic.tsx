import { Transition } from "@headlessui/react";
import { FirebaseError } from "firebase/app";
import React, { Fragment } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAuthCtx } from "../../utils/contexts/auth/AuthHook";
import { UserModel } from "../../utils/data/models/UserModel";
import { LOREM } from "../../utils/helpers/Constants";
import { waitFor } from "../../utils/helpers/DelayHelpers";
import { transitionPullV } from "../../utils/helpers/UiTransitionHelpers";
import { useNetworkAction } from "../../utils/hooks/NetworkActionHook";
import { scrollToTop } from "../../utils/hooks/RouteChangeHook";
import { firebaseApi } from "../../utils/services/network/FirestoreApi";
import GradientBackground from "../main/GradientBackground";
import StatusPlaceholder, {
  StatusPlaceholderProps,
} from "../placeholder/StatusPlaceholder";

export interface SetupProfileFormFields {
  topics: string[];
}

const dummyTopics = LOREM.split(" ");
function ProfileChooseTopic() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    resetField,
    watch,
    control,
    clearErrors,
    setError,
    reset: resetForm,
    setValue,
  } = useForm<SetupProfileFormFields>({ mode: "onChange" });

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
    isSuccess,
  } = useNetworkAction<
    StatusPlaceholderProps | null,
    StatusPlaceholderProps | null
  >({ value: false, data: null });
  const {
    authState: { user },
    authAction,
  } = useAuthCtx();
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
              clearResp();
            },
          },
        ],
      },
    });
    // console.log(loading);

    // setLoading(true);

    scrollToTop(true);
    if (!user) return alert("Not Logged in");
    await firebaseApi
      .updateProfile({
        user: { ...user, list: { ...user.list!, topics: data.topics } },
        callback: async (resp) => {
          console.log(resp);
          scrollToTop(true);
          await waitFor(1000);

          if (resp.status === "error") {
            const progress = resp.data as FirebaseError;
            // console.log(progress);
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
            stopLoading();
            setNetResp({
              ...resp,
              data: {
                title: "Setup Complete!",
                desc: "Choose youre desired topic! Let us know what kind of articles you want us to show you.",
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
      })
      .then((e) => {
        resetForm();
        authAction.setUser(e as UserModel);
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
          Choose topics that you interested in
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
              show={isError}
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

            <Transition
              appear
              show={isSuccess}
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
              <span
                className="btn btn-xs sm:btn-sm md:btn-md btn-outline
                text-xs sm:text-sm md:text-md lg:text-lg "
                onClick={() => {
                  resetField("topics");
                }}
              >
                Clear
              </span>
              <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                {dummyTopics.map((e, idx) => {
                  return (
                    <label key={idx}>
                      <input
                        type={"checkbox"}
                        value={e}
                        {...register("topics")}
                        className="hidden peer"
                      />
                      <span
                        className="btn btn-xs sm:btn-sm md:btn-md peer-checked:rounded-[var(--rounded-btn,0.5rem)] 
                        bg-opacity-0 peer-checked:bg-opacity-100 btn-primary md:border-2 transition-all duration-300
                        text-xs sm:text-sm md:text-md lg:text-lg capitalize 
                        rounded-md sm:rounded-lg md:rounded-xl
                        "
                      >
                        {e}
                      </span>
                    </label>
                  );
                })}
              </div>
              <button className="--btn-resp btn btn-primary text-lg font-bold sm:text-xl">
                Confirm
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

export default ProfileChooseTopic;
