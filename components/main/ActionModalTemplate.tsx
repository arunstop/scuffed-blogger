import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, ReactNode } from "react";
import { MainModalProps } from "../../utils/data/Main";
import GradientBackground from "./GradientBackground";

export interface ActionModalAction {
  icon?: ReactNode;
  label: string;
  action?: () => void;
}

interface ActionModalTemplateProps {
  title: string;
  children: ReactNode;
  fullscreen?: boolean;
}

const ActionModalTemplate = ({
  value,
  onClose,
  title,
  children,
  fullscreen = false,
  actions = [],
}: MainModalProps &
  ActionModalTemplateProps & { actions: ActionModalAction[] }) => {
  return (
    <Transition appear show={value} as={Fragment}>
      <Dialog
        as="div"
        className="modal modal-bottom !pointer-events-auto !visible overflow-hidden 
        !bg-opacity-0 !opacity-100 sm:modal-middle "
        onClose={onClose}
      >
        {/* OVERLAY */}
        {!fullscreen && (
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 "
            enterTo="opacity-100 "
            leave="ease-in duration-300"
            leaveFrom="opacity-100 "
            leaveTo="opacity-0 "
          >
            {/* <div className="fixed inset-0 bg-base-content/20 backdrop-blur-md" /> */}
            <div className="fixed inset-0 bg-base-content/20" />
          </Transition.Child>
        )}

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-8 sm:translate-y-0 sm:scale-[1.25]"
          enterTo="opacity-100 translate-y-0 sm:translate-y-0 sm:scale-[1.00]"
          leave="ease-in duration-300"
          leaveFrom="opacity-100 translate-y-0 sm:translate-y-0 sm:scale-[1.00]"
          leaveTo="opacity-0 translate-y-8 sm:translate-y-0 sm:scale-[0.75]"
        >
          {/* Container */}
          <Dialog.Panel
            className={`!pointer-events-none flex w-full justify-center
            p-2 sm:p-4`}
          >
            {/* Content */}
            <div
              className={`flex flex-col !pointer-events-auto relative w-full flex-1 
              !translate-y-0 !scale-[1] gap-2 sm:gap-4 rounded-lg
              ${
                fullscreen
                  ? "!rounded-none !max-w-[100vw] !w-screen !max-h-screen "
                  : "rounded-t-xl sm:!rounded-xl sm:!max-w-md md:!max-w-lg lg:!max-w-xl !max-h-screen "
              }`}
            >
              {/* gradient background */}
              <GradientBackground className="rounded-t-lg" />
              <ul
                className="flex flex-col divide-y divide-gray-400 overflow-hidden 
              rounded-lg bg-base-300/60 shadow-xl backdrop-blur-md dark:divide-base-300
              ring-1 ring-gray-400/20 dark:ring-base-300/20"
              >
                <Dialog.Title
                  as="li"
                  className="min-h-9 p-2 sm:min-h-12 sm:p-4"
                >
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-xl font-bold sm:text-2xl text-center">
                      {"Title of the action sheet: " + title}
                    </span>
                    <span className="text-base opacity-50 sm:text-lg text-center">
                      {"Description of the user-resulted action if exists."}
                    </span>
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
                    className="--btn-resp btn btn-ghost no-animation justify-between rounded-none 
                    border-x-0 !font-normal transition-all duration-300 hover:px-4 sm:hover:px-8 
                    hover:!font-black "
                    title={e.label}
                    onClick={e.action}
                  >
                    <span>{e.label}</span>
                    <span className="text-2xl">{e.icon}</span>
                  </li>
                ))}
              </ul>

              {/* Basic navigation */}
              <ul className="flex flex-row gap-4">
                <li
                  className="--btn-resp --btn-base  btn flex-1 rounded-lg border-0 shadow-lg ring-1 
                  ring-base-content/20 ring-1 ring-gray-400/20 dark:ring-base-300/20"
                  onClick={onClose}
                >
                  Cancel
                </li>

                {/* <li
                  className="btn --btn-resp rounded-lg backdrop-blur-md shadow-lg border-0 flex-1"
                >
                  OK
                </li> */}
              </ul>
              {/* {children} */}
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default ActionModalTemplate;
