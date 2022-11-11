import { Transition } from "@headlessui/react";
import React from "react";
import { ModalProps } from "../../../base/data/Main";
import Button from "../common/Button";
import Memoized from "../utils/Memoized";
import { ModalActionAction } from "./ModalActionTemplate";

export default function ModalActionConfirmation({
  value: show,
  onClose,
  action,
  closeModal,
}: ModalProps & {
  action: ModalActionAction | undefined;
  closeModal: () => void;
}) {
  return (
    <Memoized show={true} once>
      <Transition
        show={show}
        as={"div"}
        id="confirmation-modal"
        className="z-[1] flex min-w-[75%] flex-col gap-4 rounded-xl
        bg-base-300 p-4 shadow-lg ring-1 ring-gray-600/20 sm:gap-8
        sm:p-8 m-2 sm:m-4"
        enter="ease-out duration-200"
        enterFrom="opacity-0 scale-150"
        enterTo="opacity-100 scale-100"
        // leave="ease-in duration-200"
        // leaveFrom="opacity-100 scale-100"
        // leaveTo="opacity-0 scale-0"
        appear
      >
        <>
          <div className="flex flex-col gap-2 sm:gap-4">
            <span className="text-center text-xl font-bold sm:text-2xl">
              {action?.confirmation?.title || "-"}
            </span>
            <span
              className="text-center text-base text-base-content 
            brightness-75 sm:text-lg"
            >
              {action?.confirmation?.desc || "-"}
            </span>
          </div>
          <div className="inline-flex w-full flex-row-reverse gap-2 sm:gap-4">
            <Button
              className="--btn-resp btn btn-primary flex-1 rounded-xl"
              onClick={() => {
                action?.action?.();
                closeModal();
              }}
              loadingOnClick={true}
            >
              Ok
            </Button>
            <Button
              className="--btn-resp btn-outline btn flex-1 rounded-xl"
              onClick={() => onClose()}
            >
              Cancel
            </Button>
          </div>
        </>
      </Transition>
    </Memoized>
  );
}
