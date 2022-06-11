import React from "react";
import ActionModalActionItem from "./ActionModalActionItem";
import {
  ActionModalAction,
  ActionModalActionConfirmation,
} from "./ActionModalTemplate";
interface ActionModalActionSectionProps {
  actions: ActionModalAction[];
  openConfirmation: (confirmation: ActionModalActionConfirmation) => void;
}
function ActionModalActionSection({
  actions,
  openConfirmation,
}: ActionModalActionSectionProps) {
  return (
    <>
      {actions.map((e, idx) => (
        <ActionModalActionItem
          key={idx}
          openConfirmation={openConfirmation}
          {...e}
        />
      ))}
    </>
  );
}

export default ActionModalActionSection;
