import { Dialog, Transition } from "@headlessui/react";
import React from "react";
import { Fragment, ReactNode } from "react";
import { FaTimes } from "react-icons/fa";
import { ModalProps } from "../../../base/data/Main";
import Memoized from "../utils/Memoized";

interface ModalTemplateProps {
  title: string;
  children: ReactNode;
  fullscreen?: boolean;
  noHeader?: boolean;
  noCloseButton?: boolean;
  className?: string;
  initialFocus?: React.MutableRefObject<HTMLElement | null>;
  // closeBtnText?: string; // use text instead of icon
}

const ModalTemplate = ({
  value,
  onClose,
  title,
  children,
  fullscreen = false,
  noHeader = false,
  noCloseButton = false,
  className = "",
  initialFocus,
}: // closeBtnText,
ModalProps & ModalTemplateProps) => {
  return (
    <Transition appear show={value} as={Fragment}>
      <Dialog
        as="div"
        className={`fixed inset-0 z-[100] flex justify-center items-end sm:items-center ${className}`}
        onClose={onClose}
        initialFocus={initialFocus}
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
            <div className="fixed inset-0 bg-black/60  " />
            {/* <div className="fixed inset-0 bg-base-content/20" /> */}
          </Transition.Child>
        )}

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 translate-y-8 sm:translate-y-0 sm:scale-[1.25]"
          enterTo="opacity-100 translate-y-0 sm:translate-y-0 sm:scale-[1.00]"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0 sm:translate-y-0 sm:scale-[1.00]"
          leaveTo="opacity-0 translate-y-8 sm:translate-y-0 sm:scale-[0.75]"
        >
          <Dialog.Panel
            as="div"
            className={`!pointer-events-none flex w-full justify-center 
            ${fullscreen ? "h-full" : "max-h-full sm:p-8"}`}
          >
            <div
              className={`modal-box !pointer-events-auto relative flex w-full flex-1 
              !translate-y-0 !scale-[1] ring-1 ring-base-content/20
              p-0 overflow-hidden
              ${
                fullscreen
                  ? "!rounded-none !max-w-[100vw] !w-screen !max-h-screen "
                  : `rounded-t-xl rounded-b-none max-w-full sm:!rounded-xl sm:!max-w-md md:!max-w-lg lg:!max-w-xl 
                  !max-h-[90vh]`
              }`}
            >
              <div
                id={`modal-content`}
                className={`flex flex-col gap-4 overflow-auto w-full`}
              >
                {/* gradient background */}
                {/* <GradientBackground height="100%" /> */}
                <Memoized show once>
                  <Header
                    show={value}
                    noCloseButton={noCloseButton}
                    onClose={onClose}
                    title={title}
                  />
                </Memoized>
                {children}
              </div>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

const Header = ({
  show,
  title,
  noCloseButton,
  onClose,
}: {
  show: boolean;
  title: string;
  noCloseButton: boolean;
  onClose: () => void;
}) => {
  return (
    <>
      <Dialog.Title
        as="div"
        className="hidden sm:block p-2 sm:p-4 z-[1] bg-base-100/70 backdrop-blur-md animate-fadeInDown
                  sticky top-0 duration-500"
      >
        <div className="flex flex-row items-center justify-between">
          <span className="text-xl font-bold sm:text-2xl">{title}</span>
          {noCloseButton || (
            <span
              className="btn btn-ghost btn-sm aspect-square !h-9 !w-9 rounded-xl 
                        !p-0 opacity-80 hover:opacity-100 sm:btn-md sm:!h-12 sm:!w-12"
              title="Back"
              onClick={onClose}
            >
              <FaTimes className="text-2xl sm:text-3xl" />
            </span>
          )}
        </div>
      </Dialog.Title>
    </>
  );
};

export default ModalTemplate;
