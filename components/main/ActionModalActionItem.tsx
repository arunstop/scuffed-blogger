import React from "react";
import {
  ActionModalAction,
  ActionModalActionConfirmation,
} from "./ActionModalTemplate";

function ActionModalActionItem({
  label,
  confirmation,
  icon,
  action,
  openConfirmation,
}: ActionModalAction & {
  action?: () => void;
  openConfirmation: (confirmation: ActionModalActionConfirmation) => void;
}) {
  return (
    <li
      className="--btn-resp group btn btn-ghost no-animation flex-nowrap 
      justify-between gap-2 rounded-none border-x-0 !font-medium transition-all 
      duration-300 hover:px-4 hover:!font-black sm:gap-4 sm:hover:px-8"
      title={label}
      onClick={confirmation ? () => openConfirmation(confirmation) : action}
    >
      <span className="truncate">{label + " " + !!confirmation + ""}</span>
      {/* <span className="text-2xl transition-transform duration-300 ease-in group-hover:-scale-x-100">{icon}</span> */}
      <span className="text-2xl transition-transform duration-300">{icon}</span>
    </li>
  );
}

export default ActionModalActionItem;
