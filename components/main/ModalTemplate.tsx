import { Transition, Dialog } from "@headlessui/react";
import React, { Fragment, ReactNode } from "react";
import { FaTimes } from "react-icons/fa";

interface ModalTemplateProps {
  value: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const ModalTemplate = ({
  value,
  onClose,
  title,
  children,
}: ModalTemplateProps) => {
  return (
    <Transition appear show={value} as={Fragment}>
      <Dialog
        as="div"
        className="modal modal-bottom !pointer-events-auto !visible !bg-opacity-0 !opacity-100 sm:modal-middle overflow-hidden"
        onClose={onClose}
      >
        {/*  */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 "
          enterTo="opacity-100 "
          leave="ease-in duration-300"
          leaveFrom="opacity-100 "
          leaveTo="opacity-0 "
        >
          <div className="fixed inset-0 bg-base-content/20" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-8 sm:translate-y-0 sm:scale-[1.25]"
          enterTo="opacity-100 translate-y-0 sm:translate-y-0 sm:scale-[1.00]"
          leave="ease-in duration-300"
          leaveFrom="opacity-100 translate-y-0 sm:translate-y-0 sm:scale-[1.00]"
          leaveTo="opacity-0 translate-y-8 sm:translate-y-0 sm:scale-[0.75]"
        >
          <Dialog.Panel className="flex w-full justify-center sm:p-8">
            <div className="modal-box relative flex w-full flex-1 !translate-y-0 !scale-[1] flex-col gap-4 ring-2 ring-base-content/20 sm:!max-w-[48rem]">
              {/* gradient background */}
              <div className="absolute inset-0 z-[-1] h-[75%] bg-gradient-to-b from-primary-focus/75 via-primary/50 to-transparent"></div>
              <Dialog.Title as="div" className="">
                <div className="flex flex-row items-center justify-between">
                  <span className="text-2xl font-bold">{title}</span>
                  <a
                    className="btn-outline btn btn-sm aspect-square !h-9 !w-9 rounded-xl 
                    !p-0 opacity-80 hover:opacity-100 sm:btn-md sm:!h-12 sm:!w-12"
                    title="Back"
                    onClick={onClose}
                  >
                    <FaTimes className="text-2xl sm:text-3xl" />
                  </a>
                </div>
              </Dialog.Title>
              {children}
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default ModalTemplate;
