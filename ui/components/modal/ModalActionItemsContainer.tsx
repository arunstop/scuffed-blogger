import React from "react";
import ModalActionItem from "./ModalActionItem";
import {
  ModalActionAction
} from "./ModalActionTemplate";

export default function ModalActionItemsContainer({
  show,
  actions,
  openConfirmation,
  closeModal,
}: {
  show: boolean;
  actions: ModalActionAction[];
  openConfirmation: (value: ModalActionAction) => void;
  closeModal:()=>void;
}) {
  return (
    <>
      {actions.map((e, idx) => {
        return (
          <ModalActionItem
            key={idx}
            openConfirmation={openConfirmation}
            closeModal={closeModal}
            {...e}
          />
        );
      })}
    </>
  );
}
