import { Transition } from "@headlessui/react";
import React from "react";
import { ModalProps } from "../../../base/data/Main";
import { ModalActionAction } from "./ModalActionTemplate";

function ModalActionConfirmation({
  value: show,
  onClose,
  action,
  closeModal,
}: ModalProps & { action: ModalActionAction | undefined,closeModal:()=>void }) {
  return (
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
      <MzContent show={show} action={action} closeConfirmation={() => onClose()} closeModal={closeModal}/>
    </Transition>
  );
}

const Content = ({
  show,
  action,
   closeConfirmation,
   closeModal,
}: {
  show: boolean;
  action?: ModalActionAction;
  closeConfirmation: () => void;
  closeModal: () => void;
}) => {
  return (
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
        <button
          className="--btn-resp btn btn-primary flex-1 rounded-xl"
          onClick={() => {
            action?.action?.();
            closeModal();
          }}
        >
          OK
        </button>
        <button
          className="--btn-resp btn-outline btn flex-1 rounded-xl"
          onClick={() => closeConfirmation()}
        >
          Cancel
        </button>
      </div>
    </>
  );
};

const MzContent = React.memo(Content, (prev, next) => {
  const memoize = (prev.show === false && next.show === true) ===false;
  return memoize;
});

export default React.memo(ModalActionConfirmation);
