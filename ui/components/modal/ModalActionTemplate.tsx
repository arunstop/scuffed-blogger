import { Dialog, Transition } from "@headlessui/react";
import { Fragment, ReactNode } from "react";
import { ModalProps } from "../../../base/data/Main";
import useOptionModalConfirmationHook from "../../../app/hooks/PostOptionConfirmationModalBehaviorHook";
import GradientBackground from "../utils/GradientBackground";
import ModalActionItem from "./ModalActionItem";
import ModalActionConfirmation from "./ModalActionConfirmation";
import { transitionPullV } from "../../../app/helpers/UiTransitionHelpers";
import React from "react";

export interface ModalActionConfirmation {
  title: string;
  desc: string;
}

// If action has confirmation
// a confirmation alert will show up
export interface ModalActionAction {
  icon?: ReactNode;
  label: string;
  confirmation?: ModalActionConfirmation;
  hidden?: boolean;
  action?: () => void;
}

export interface ModalConfirmation {
  className?: string;
  label: string;
  action?: () => void;
}

interface MainActionModalTemplateProps {
  title: string;
  children?: ReactNode;
  fullscreen?: boolean;
  desc?: string;
}

const ModalActionTemplate = ({
  value,
  onClose,
  title,
  desc,
  children,
  fullscreen = false,
  actions,
  confirmations,
}: ModalProps &
  MainActionModalTemplateProps & {
    actions?: ModalActionAction[];
    confirmations?: ModalConfirmation[];
  }) => {
  const confirmation = useOptionModalConfirmationHook();

  function closeModal() {
    confirmation.close();
    onClose();
  }

  const isConfirmation = !!confirmations?.length;
  const isAction = !!actions?.length;

  return (
    <Transition appear show={value} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-[999] flex items-end justify-center sm:items-center"
        onClose={closeModal}
      >
        {/* OVERLAY */}
        {!fullscreen && (
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-500"
            enterFrom="opacity-0 "
            enterTo="opacity-100 "
            leave="ease-in duration-200"
            leaveFrom="opacity-100 "
            leaveTo="opacity-0 "
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            {/* <div className="fixed inset-0 bg-black/60" /> */}
          </Transition.Child>
        )}

        <Transition.Child
          as={Fragment}
          {...transitionPullV({
            enter: "!duration-300",
          })}
        >
          {/* Container */}
          <Dialog.Panel
            as={"div"}
            className={`!pointer-events-none flex w-full justify-center
            p-2 sm:p-4`}
          >
            {/* Content */}
            <div
              className={`flex flex-col !pointer-events-auto relative w-full flex-1 
              !translate-y-0 !scale-[1] gap-2 sm:gap-4 rounded-xl
              ${
                fullscreen
                  ? "!rounded-none !max-w-[100vw] !w-screen !max-h-screen "
                  : "rounded-t-xl sm:!rounded-xl sm:!max-w-md md:!max-w-lg lg:!max-w-xl !max-h-screen "
              }`}
            >
              {/* gradient background */}
              <GradientBackground className={`rounded-t-xl `} />
              {/* Modal box */}
              <ul
                className={`relative z-10 flex flex-col divide-y 
                divide-gray-600/20 overflow-hidden !rounded-xl shadow-xl
                ring-1 ring-gray-600/20 `}
              >
                {/* Backdrop blur */}
                <div className="absolute inset-0 z-[-1] rounded-xl bg-base-300/60 backdrop-blur-md" />

                {/* Title section */}
                <Dialog.Title
                  as="div"
                  className={`min-h-12  sm:min-h-16 ${
                    isConfirmation ? `p-4 sm:p-8` : `p-2 sm:p-4`
                  }`}
                >
                  <div
                    className={`flex flex-col items-center justify-center  ${
                      isConfirmation ? `gap-4 sm:gap-8` : `gap-1 sm:gap-2`
                    } `}
                  >
                    <span className="text-center text-xl font-bold sm:text-2xl">
                      {title}
                    </span>
                    {desc && (
                      <span className="text-center text-base text-base-content sm:text-lg">
                        {desc}
                      </span>
                    )}
                  </div>
                </Dialog.Title>

                {isAction && (
                  <>
                    {/* Action section */}
                    <>
                      {actions.map((e, idx) => {
                        if (e.hidden) return;
                        return (
                          <ModalActionItem
                            key={idx}
                            openConfirmation={confirmation.open}
                            {...e}
                          />
                        );
                      })}
                    </>
                    {/* Confirmation dialog */}
                    <ModalActionConfirmation
                      value={confirmation.show}
                      onClose={() => confirmation.close()}
                      confirmation={confirmation.data}
                    />
                  </>
                )}
              </ul>

              {/* Basic navigation */}
              <div className="flex flex-col sm:flex-row-reverse gap-2 sm:gap-4">
                {isConfirmation &&
                  confirmations.map((e, idx) => {
                    return (
                      <div
                        key={idx}
                        className=" animate-fadeInUp animate-duration-500 w-full flex-1 flex"
                        style={{ animationDelay: `${(idx + 1) * 100}ms` }}
                      >
                        <button
                          className={`--btn-resp --btn-base  btn rounded-xl border-0 shadow-xl
                        ring-1 ring-gray-600/20 w-full ${e.className}`}
                          onClick={e.action}
                          role={"button"}
                        >
                          {e.label}
                        </button>
                      </div>
                    );
                  })}
                {!isConfirmation && (
                  <div className="animate-fadeInUp animate-duration-500 animate-delay-100 flex-1 flex">
                    <button
                      className="--btn-resp --btn-base  btn rounded-xl border-0 shadow-xl 
                      ring-1 ring-gray-600/20 w-full"
                      onClick={closeModal}
                      role={"button"}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              {/* {children} */}
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default React.memo(ModalActionTemplate);
