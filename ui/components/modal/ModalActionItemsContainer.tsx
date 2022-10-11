import React from "react";
import ModalActionItem from "./ModalActionItem";
import {
  ModalActionAction,
  ModalActionConfirmation,
} from "./ModalActionTemplate";

function ModalActionItemsContainer({
  actions,
  openConfirmation,
}: {
  actions: ModalActionAction[];
  openConfirmation: (value: ModalActionConfirmation | undefined) => void;
}) {
  return (
    <>
      {actions.map((e, idx) => {
        return (
          <ModalActionItem
            key={idx}
            openConfirmation={openConfirmation}
            {...e}
          />
        );
      })}
    </>
  );
}

export default React.memo(ModalActionItemsContainer, (prev, next) => {
  // don't change anything if the next's props has no actions
  if (next.actions.length) return true;
  return false;
});
