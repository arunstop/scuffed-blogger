import { Transition } from "@headlessui/react";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdSearch } from "react-icons/md";
import { useAuthCtx } from "../../utils/contexts/auth/AuthHook";
import { UserModel } from "../../utils/data/models/UserModel";
import { LOREM } from "../../utils/helpers/Constants";
import { waitFor } from "../../utils/helpers/DelayHelpers";
import { transitionPullV } from "../../utils/helpers/UiTransitionHelpers";
import { useNetworkAction } from "../../utils/hooks/NetworkActionHook";
import { scrollToTop } from "../../utils/hooks/RouteChangeHook";
import { firebaseApi } from "../../utils/services/network/FirebaseApi";
import MainTextInput from "../input/MainTextInput";
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
    formState: { errors, isValid },
    handleSubmit,
    resetField,
    watch,
    control,
    clearErrors,
    setError,
    reset: resetForm,
    setValue,
    getValues,
    trigger,
  } = useForm<SetupProfileFormFields>({
    mode: "onChange",
    defaultValues: {
      topics: [],
    },
  });

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
    authStt: { user },
    authAct,
  } = useAuthCtx();

  const router = useRouter();

  const selectedTopics = watch("topics");

  const [search, setSearch] = useState("");
  // const [selectedTopics, setSearch] = useState("");

  const searchedList = dummyTopics.filter((e) =>
    e.toLowerCase().includes(search.toLowerCase().trim()),
  );

  const onSubmit: SubmitHandler<SetupProfileFormFields> = async (data) => {
    if (!hasLoaded) {
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
    }

    if (!user) return alert("Not Logged in");
    await firebaseApi
      .updateProfile({
        user: {
          ...user,
          profileCompletion: "COMPLETE",
          list: { ...user.list!, topics: data.topics },
        },
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
                desc: "Congratulations! Your account is now completely set up! Redirecting you to the main page...",
                status: "success",
                actions: [
                  {
                    label: "Cancel",
                    callback: () => {
                      setLoading({ value: false, data: null });
                    },
                  },
                  {
                    label: "Continue",
                    callback: () => {
                      router.push("/");
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
        authAct.setUser(e as UserModel);
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
            <div
              className="form-control mx-auto flex w-full flex-col gap-4 p-4 sm:max-w-md sm:gap-8 
              sm:p-8 md:max-w-lg lg:max-w-xl"
              // onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-2 sm:gap-4 items-center">
                <span
                  className={`text-xs sm:text-sm md:text-md lg:text-lg font-bold text-center whitespace-pre ${
                    errors.topics ? "text-error" : ""
                  }`}
                >
                  {selectedTopics.length < 3 && selectedTopics.length !== 0
                    ? `You have choosen: ${selectedTopics.join(", ")}\nChoose ${
                        3 - selectedTopics.length
                      } more topics`
                    : selectedTopics.length === 0
                    ? "Choose at least 3 topics of your interest to continue.\nYou can change it anytime."
                    : `You have choosen: ${selectedTopics.join(
                        ", ",
                      )}\nThis will determine what kind of article you will be shown`}
                </span>
              </div>
              <div className="flex gap-2 sm:gap-4 items-center">
                <MainTextInput
                  type="text"
                  placeholder="Technology..."
                  icon={<MdSearch />}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  clearable
                />
                {selectedTopics.length !== 0 && (
                  <span
                    className={`btn btn-xs sm:btn-sm btn-outline text-xs sm:text-sm 
                    md:text-md`}
                    onClick={() => {
                      resetField("topics");
                    }}
                  >
                    Clear
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-2 content-start justify-center h-96 overflow-auto">
                {!searchedList.length && (
                  <span className="font-semibold text-xs sm:text-sm md:text-md">
                    Cannot find any topics matched with{" "}
                    <span className="font-black">`{search}`</span>
                  </span>
                )}
                {searchedList.map((e, idx) => {
                  return (
                    <label key={idx}>
                      <input
                        type={"checkbox"}
                        value={e}
                        checked={selectedTopics.includes(e)}
                        className="hidden peer"
                        onChange={(ev) => {
                          if (ev.target.checked)
                            setValue("topics", [...selectedTopics, e]);
                          else
                            setValue("topics", [
                              ...selectedTopics.filter((el) => el !== e),
                            ]);
                          trigger("topics");
                        }}
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
              <form className="flex" onSubmit={handleSubmit(onSubmit)}>
                <input
                  type={"checkbox"}
                  className="hidden"
                  {...register("topics", {
                    // required: {
                    //   value: true,
                    //   message: "Please choose at least 3 topics",
                    // },
                    validate: {
                      minimum: (e) => {
                        if (e.length < 3)
                          return "Please choose at least 3 topics";
                        return true;
                      },
                    },
                  })}
                />
                <button
                  className="--btn-resp btn btn-primary text-lg font-bold sm:text-xl w-full"
                  onClick={() => {
                    scrollToTop(true);
                  }}
                >
                  Confirm
                </button>
              </form>

              <span
                className="--btn-resp btn btn-link p-0 !text-base font-bold text-primary-content sm:!text-lg"
                onClick={() => {}}
                tabIndex={-1}
              >
                Maybe later
              </span>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
}

export default ProfileChooseTopic;
