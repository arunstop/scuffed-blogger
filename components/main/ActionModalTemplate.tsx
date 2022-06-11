import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, ReactNode } from "react";
import { MainModalProps } from "../../utils/data/Main";
import useOptionModalConfirmationHook from "../../utils/hooks/PostOptionConfirmationModalBehaviorHook";

import ActionModalActionItem from "./ActionModalActionItem";
import ConfirmationModalTemplate from "./ConfirmationModalTemplate";
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
  const confirmation = useOptionModalConfirmationHook();

  function closeModal() {
    confirmation.close();
    onClose();
  }
  console.log("render ActionModal Template" + confirmation.data?.title);

  // const laggedConfirmation = useMemo(() => confirmation, [confirmation]);
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
            <div className="fixed inset-0 bg-black/60" />
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
              <GradientBackground className="rounded-t-xl" />
              {/* Modal box */}
              <ul
                className="relative z-10 flex flex-col divide-y 
                divide-gray-600/20 overflow-hidden !rounded-xl shadow-xl
                ring-1 ring-gray-600/20"
              >
              {/* Backdrop blur */}
                <div className="absolute inset-0 z-[-1] rounded-xl bg-base-300/60 backdrop-blur-md" />

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
                    </div>
                  </Dialog.Title>

                  {actions.map((e, idx) => (
                    <ActionModalActionItem
                      key={idx}
                      openConfirmation={confirmation.open}
                      {...e}
                    />
                  ))}
                </>
                {/* Confirmation dialog */}
                <ConfirmationModalTemplate
                  value={confirmation.show}
                  onClose={() => confirmation.close()}
                  confirmation={confirmation.data}
                />
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
                <button
                  className="--btn-resp --btn-base  btn flex-1 rounded-xl border-0 shadow-lg
                  ring-1 ring-gray-600/20"
                  onClick={closeModal}
                  role={"button"}
                >
                  Cancel
                </button>
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
