import React from "react";
import ModalActionItem from "./ModalActionItem";
import {
  ModalActionAction
} from "./ModalActionTemplate";

function ModalActionItemsContainer({
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

export default React.memo(ModalActionItemsContainer, (prev, next) => {
  // re-render when the prev has the same length as the next
  if (prev.show === false && next.show === true) return false;
  return true;
});
