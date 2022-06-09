import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, ReactNode } from "react";
import { MainModalProps } from "../../utils/data/Main";
import useOptionModalConfirmationHook from "../../utils/hooks/OptionModalConfirmationHook";
import GradientBackground from "./GradientBackground";

export interface ActionModalActionConfirmation {
  title: string;
  desc: string;
}

// If action has confirmation
// a confirmation alert will show up
export interface ActionModalAction {
  icon?: ReactNode;
  label: string;
  confirmation?: ActionModalActionConfirmation;
  action?: () => void;
}

interface ActionModalTemplateProps {
  title: string;
  children?: ReactNode;
  fullscreen?: boolean;
  desc?: string;
}

const ActionModalTemplate = ({
  value,
  onClose,
  title,
  desc,
  children,
  fullscreen = false,
  actions = [],
}: MainModalProps &
  ActionModalTemplateProps & { actions: ActionModalAction[] }) => {
  const { confirmation, closeConfirmation, openConfirmation } =
    useOptionModalConfirmationHook();

  function closeModal() {
    closeConfirmation();
    onClose();
  }
  return (
    <Transition appear show={value} as={Fragment}>
      <Dialog
        as="div"
        className="modal modal-bottom !pointer-events-auto !visible overflow-hidden 
        !bg-opacity-0 !opacity-100 sm:modal-middle "
        onClose={closeModal}
      >
        {/* OVERLAY */}
        {!fullscreen && (
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 "
            enterTo="opacity-100 "
            leave="ease-in duration-200"
            leaveFrom="opacity-100 "
            leaveTo="opacity-0 "
          >
            {/* <div className="fixed inset-0 bg-base-content/20 backdrop-blur-sm" /> */}
            <div className="fixed inset-0 bg-base-content/20" />
          </Transition.Child>
        )}

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 translate-y-72 sm:translate-y-0 sm:scale-150"
          enterTo="opacity-100 translate-y-0 sm:translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0 sm:translate-y-0 sm:scale-100"
          leaveTo="opacity-0 translate-y-72 sm:translate-y-0 sm:scale-0"
        >
          {/* Container */}
          <Dialog.Panel
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
              <GradientBackground className="rounded-t-xl" />
              {/* Modal box */}
              <ul
                className="relative flex flex-col divide-y divide-gray-600/20 
                overflow-hidden !rounded-xl bg-base-300/60 shadow-xl ring-1
                ring-gray-600/20 backdrop-blur-md z-10"
              >
                <>
                  <Dialog.Title
                    as="div"
                    className="min-h-9 p-2 sm:min-h-12 sm:p-4"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-center text-xl font-bold sm:text-2xl">
                        {title}
                      </span>
                      {desc && (
                        <span className="text-center text-base text-base-content text-opacity-75 sm:text-lg">
                          {desc}
                        </span>
                      )}
                      {/* <a
                      className="btn-outline btn btn-sm aspect-square !h-9 !w-9 rounded-xl 
                    !p-0 opacity-80 hover:opacity-100 sm:btn-md sm:!h-12 sm:!w-12"
                      title="Back"
                      onClick={onClose} 
                    >
                      <FaTimes className="text-2xl sm:text-3xl" />
                    </a> */}
                    </div>
                  </Dialog.Title>

                  {actions.map((e, idx) => (
                    <li
                      key={idx}
                      className="--btn-resp group btn btn-ghost no-animation flex-nowrap 
                    justify-between gap-2 rounded-none border-x-0 !font-medium transition-all 
                    duration-300 hover:px-4 hover:!font-black sm:gap-4 sm:hover:px-8"
                      title={e.label}
                      onClick={
                        e.confirmation
                          ? () => openConfirmation(e.confirmation!)
                          : e.action
                      }
                    >
                      <span className="truncate">
                        {e.label + " " + !!e.confirmation + ""}
                      </span>
                      {/* <span className="text-2xl transition-transform duration-300 ease-in group-hover:-scale-x-100">{e.icon}</span> */}
                      <span className="text-2xl transition-transform duration-300">
                        {e.icon}
                      </span>
                    </li>
                  ))}
                </>
                {/* Confirmation dialog */}
                <Transition
                  as={"div"}
                  show={confirmation !== null}
                  appear
                  className="absolute inset-0 flex flex-col items-center 
                    justify-center p-4 sm:p-8 "
                  enter="ease-out duration-200"
                  enterFrom="opacity-0 scale-150"
                  enterTo="opacity-100 sm:scale-100"
                  // leave="ease-in duration-200"
                  // leaveFrom="opacity-100 sm:scale-100"
                  // leaveTo="opacity-0 scale-0"
                >
                  <div
                    className="flex flex-col gap-4 sm:gap-8 rounded-xl bg-base-300
                      p-4 sm:p-8 min-w-[75%] ring-1 ring-gray-600/20 shadow-lg"
                  >
                    <div className="flex flex-col gap-2 sm:gap-4">
                      <span className="text-center text-xl font-bold sm:text-2xl">
                        {confirmation?.title || "-"}
                      </span>
                      <span
                        className="text-center text-base text-base-content 
                        text-opacity-75 sm:text-lg"
                      >
                        {confirmation?.desc || "-"}
                      </span>
                    </div>
                    <div className="inline-flex flex-row-reverse gap-2 sm:gap-4 w-full">
                      <button
                        className="btn flex-1 --btn-resp btn-primary rounded-xl"
                        onClick={() => closeConfirmation()}
                      >
                        OK
                      </button>
                      <button
                        className="btn flex-1 --btn-resp btn-outline rounded-xl"
                        onClick={() => closeConfirmation()}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </Transition>
              </ul>

              {/* Basic navigation */}
              <div className="flex flex-row-reverse gap-2 sm:gap-4">
                {/* <a
                  className="--btn-resp btn-primary  btn flex-1 rounded-xl border-0 shadow-lg ring-1 
                  ring-1 ring-gray-600/20"
                  onClick={onClose}
                  role={"button"}
                >
                  OK
                </a> */}
                <a
                  className="--btn-resp --btn-base  btn flex-1 rounded-xl border-0 shadow-lg
                  ring-1 ring-gray-600/20"
                  onClick={closeModal}
                  role={"button"}
                >
                  Cancel
                </a>
              </div>
              {/* {children} */}
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default ActionModalTemplate;
