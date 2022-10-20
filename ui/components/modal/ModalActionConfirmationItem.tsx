import React from "react";
import { ModalActionConfirmation } from "./ModalActionTemplate";

function ModalActionConfirmationItem({
  desc,
  title,
  action,
  value,
}: ModalActionConfirmation & { action?: () => void; value: boolean }) {
  return (
    // <Transition
    //   as={Fragment}
    //   show={value}
    //   enter="ease-out duration-200"
    //   enterFrom="opacity-0 scale-y-150"
    //   enterTo="opacity-100 scale-y-100"
    //   leave="ease-in duration-200"
    //   leaveFrom="opacity-100 scale-y-100"
    //   leaveTo="opacity-0 scale-y-0"
    // >
      <div
        className="z-[1] flex min-w-[75%] flex-col gap-4 rounded-xl
        bg-base-300 p-4 shadow-lg ring-1 ring-gray-600/20 sm:gap-8
        sm:p-8"
      >
        <div className="flex flex-col gap-2 sm:gap-4">
          <span className="text-center text-xl font-bold sm:text-2xl">
            {title || "-"}
          </span>
          <span
            className="text-center text-base text-base-content 
            brightness-75 sm:text-lg"
          >
            {desc || "-"}
          </span>
        </div>
        <div className="inline-flex w-full flex-row-reverse gap-2 sm:gap-4">
          <button
            className="--btn-resp btn btn-primary flex-1 rounded-xl"
            onClick={action}
          >
            OK
          </button>
          <button
            className="--btn-resp btn-outline btn flex-1 rounded-xl"
            onClick={action}
          >
            Cancel
          </button>
        </div>
      </div>
    // </Transition>
  );
}

export default ModalActionConfirmationItem;
