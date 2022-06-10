import { Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { MainModalProps } from "../../utils/data/Main";
import { ActionModalActionConfirmation } from "./ActionModalTemplate";

function ConfirmationModalTemplate({
  value,
  onClose,
  confirmation,
}: MainModalProps & { confirmation?: ActionModalActionConfirmation }) {
  return (
    <Transition
      show={value}
      as={"div"}
      className="absolute inset-0 flex flex-col items-center 
      justify-center p-4 sm:p-8"
      appear
      unmount={true}
    >
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
      <div className="absolute inset-0 bg-base-content/50"></div>
      </Transition.Child>

      <Transition.Child
        as={"div"}
        className="flex flex-col gap-4 sm:gap-8 rounded-xl bg-base-300
        p-4 sm:p-8 min-w-[75%] ring-1 ring-gray-600/20 shadow-lg
        z-[1]"
        enter="ease-out duration-200"
        enterFrom="opacity-0 scale-150"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-0"
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
            onClick={() => onClose()}
          >
            OK
          </button>
          <button
            className="btn flex-1 --btn-resp btn-outline rounded-xl"
            onClick={() => onClose()}
          >
            Cancel
          </button>
        </div>
      </Transition.Child>
    </Transition>
  );
}

export default React.memo(ConfirmationModalTemplate);
