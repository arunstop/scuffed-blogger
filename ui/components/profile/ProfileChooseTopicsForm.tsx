import { Transition } from "@headlessui/react";
import { FirebaseError } from "firebase/app";
import { debounce } from "lodash";
import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdSearch } from "react-icons/md";
import { useAuthCtx } from "../../../app/contexts/auth/AuthHook";
import { waitFor } from "../../../app/helpers/DelayHelpers";
import { autoRetry } from "../../../app/helpers/MainHelpers";
import { transitionPullV } from "../../../app/helpers/UiTransitionHelpers";
import { useNetworkAction } from "../../../app/hooks/NetworkActionHook";
import { scrollToTop } from "../../../app/hooks/RouteChangeHook";
import { serviceTopicGetAll } from "../../../app/services/TopicService";
import { fbUserUpdate } from "../../../app/services/UserService";
import { UserModel } from "../../../base/data/models/UserModel";
import Alert from "../common/Alert";
import InputText from "../input/InputText";
import LoadingIndicator from "../placeholder/LoadingIndicator";
import StatusPlaceholder, {
  StatusPlaceholderProps,
} from "../placeholder/StatusPlaceholder";
import GradientBackground from "../utils/GradientBackground";

export interface SetupProfileFormFields {
  topics: string[];
}
// TODO: use real data fro rtdb

function ProfileChooseTopicsForm() {
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

  const [keyword, setKeyword] = useState("");
  // const [selectedTopics, setSearch] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [topicsInit, setTopicsInit] = useState<string[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const controllerRef = useRef<AbortController>(new AbortController());

  const getTopics = async () => {
    // get topics from rtdb
    const topicsFromDb = await autoRetry(
      async () => await serviceTopicGetAll({ data: { keyword: "" } }),
    );
    if (!topicsFromDb) return;
    // set states
    setLoadingTopics(false);
    setTopics(topicsFromDb);
    setTopicsInit(topicsFromDb);
  };

  useEffect(() => {
    getTopics();
    return () => {};
  }, []);

  const onSubmit: SubmitHandler<SetupProfileFormFields> = async (data) => {
    if (!hasLoaded) {
      clearResp();
      setNetResp({
        message: "",
        status: "loading",
        data: {
          status: "loading",
          title: "Updating your choosen topics",
          desc: `Just determining what kind of amazing articles we will show you, based on those topics you have chhosen. 
          We promise this will be quick.`,
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
    await fbUserUpdate({
      data: {
        user: {
          ...user,
          profileCompletion: "COMPLETE",
          list: { ...user.list!, topics: data.topics },
        },
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
              desc: "Congratulations! Your account is now completely set up! Brace yourself! Ocean of amazing articles ahead!",
              status: "success",
              actions: [
                {
                  label: "Choose again",
                  callback: () => {
                    clearResp();
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
    }).then((e) => {
      resetForm();
      authAct.setUser(e as UserModel);
    });
  };

  const debounceSearch = debounce(
    async ({ q, abortSignal }: { q: string; abortSignal: AbortSignal }) => {
      const res = await autoRetry(
        async () =>
          await serviceTopicGetAll({
            data: { keyword: q, abortSignal: abortSignal },
          }),
      );
      if (!res || !res.length) {
        setTopics([]);
        setLoadingTopics(false);
        return;
      }

      setTopics(res);
      setLoadingTopics(false);
    },
    500,
  );

  const search = useCallback(
    (val: string) => {
      setKeyword(val);
      const isAborted = controllerRef.current.signal.aborted;

      if (val.trim().toLowerCase().length < 2) {
        console.log(topicsInit);

        controllerRef.current.abort("Too few keyword");
        // set topics to the initial topics value if input value is empty
        if (val.trim().toLowerCase().length === 0)
          return setTopics((prev) => {
            if (prev.toString() === topicsInit.toString()) return prev;
            return topicsInit;
          });
        return;
      }

      setLoadingTopics(true);

      if (isAborted) controllerRef.current = new AbortController();

      debounceSearch({ q: val, abortSignal: controllerRef.current.signal });
    },
    [topics, topicsInit],
  );

  const handleSearch = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      search(ev.target.value);
    },
    [topics, topicsInit],
  );

  const clear = useCallback(() => {
    resetField("topics");
    setTopics(topicsInit);
    setKeyword("");
    document.getElementById("container-topics")?.scrollTo({
      top: 0,
    });
    scrollToTop();
  }, [topicsInit]);

  return (
    <>
      <Transition
        show={!netResp?.data}
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
          {/* Status States*/}
          <Transition
            appear
            show={!!netResp}
            as={"div"}
            className={"absolute inset-0 "}
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
            show={!netResp?.data}
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
              <div className="flex flex-col gap-2 sm:gap-4 text-center text-xs sm:text-sm md:text-md lg:text-lg font-bold text-center">
                {!selectedTopics.length && (
                  <span className="whitespace-pre-line">
                    {`Choose at least 3 topics of your interest to continue.\nYou can change them anytime.`}
                  </span>
                )}
                {/* topics amount not yet satisfied */}
                {!!selectedTopics.length && selectedTopics.length < 3 && (
                  <div className="flex flex-col gap-1">
                    <span>You have choosen : </span>
                    <Alert className="bg-error/50">
                      <span
                        key={selectedTopics.length}
                        className="animate-fadeIn animate-duration-300"
                      >
                        {selectedTopics.join(` ${String.fromCharCode(8212)} `)}
                      </span>
                    </Alert>
                    <span className="text-error">
                      {`Please choose ${3 - selectedTopics.length} more`}
                    </span>
                  </div>
                )}
                {selectedTopics.length >= 3 && (
                  <div className="flex flex-col gap-1">
                    <span>You have choosen : </span>
                    <Alert>
                      <span
                        key={selectedTopics.length}
                        className="animate-fadeIn animate-duration-300"
                      >
                        {selectedTopics.join(` ${String.fromCharCode(8212)} `)}
                      </span>
                    </Alert>
                    <span>
                      {` ${selectedTopics.length} topics selected, you can proceed now.`}
                    </span>
                  </div>
                )}

                <span>
                  This will determine what kind of articles you will be shown
                </span>
              </div>
              <div className="flex gap-2 sm:gap-4 items-center">
                <InputText
                  type="text"
                  placeholder="Technology..."
                  icon={<MdSearch />}
                  value={keyword}
                  onChange={handleSearch}
                  clearIcon={keyword.trim().length>=2}
                  clearable
                  clearAction={()=>{
                    setKeyword("");
                    setTopics(topicsInit);
                  }}
                />
                {selectedTopics.length !== 0 && (
                  <span
                    className={`btn btn-xs sm:btn-sm btn-outline text-xs sm:text-sm 
                    md:text-md`}
                    onClick={() => clear()}
                  >
                    Clear
                  </span>
                )}
              </div>

              <div
                id="container-topics"
                className="flex flex-wrap gap-1 sm:gap-2 content-start justify-center h-96 overflow-auto px-2"
              >
                {/* Loading indicator */}
                {loadingTopics ? (
                  <div className={`w-full`}>
                    <LoadingIndicator text={`Loading Topics`} spinner />
                  </div>
                ) : (
                  <>
                    {/* Not found */}
                    {!topics.length && (
                      <span className="font-semibold text-xs sm:text-sm md:text-md">
                        Cannot find any topics matched with{" "}
                        <span className="font-black">`{keyword}`</span>
                      </span>
                    )}
                    {topics.map((e, idx) => {
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
                  </>
                )}
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

export default ProfileChooseTopicsForm;
