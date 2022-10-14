import React from "react";
import {
  ModalActionAction,
  ModalActionConfirmation,
} from "./ModalActionTemplate";

function ModalActionItem({
  label,
  confirmation,
  icon,
  action,
  openConfirmation,
}: ModalActionAction & {
  action?: () => void;
  openConfirmation: (confirmation: ModalActionConfirmation) => void;
}) {
  return (
    <li
      className="odd:animate-fadeInUp even:animate-fadeInDown
      odd:animate-duration-500 even:animate-duration-500 flex w-full"
    >
      <div
        className="--btn-resp group btn btn-ghost no-animation flex-nowrap 
        justify-between gap-2 rounded-none border-x-0 !font-medium transition-all 
        duration-300 hover:px-4 hover:!font-black sm:gap-4 sm:hover:px-8
        w-full
      "
        title={label}
        onClick={confirmation ? () => openConfirmation(confirmation) : action}
      >
        <span className="truncate">
          {label} {!!confirmation && <>&middot;</>}
        </span>
        {/* <span className="text-2xl transition-transform duration-300 ease-in group-hover:-scale-x-100">{icon}</span> */}
        <span className="text-2xl transition-transform duration-300">
          {icon}
        </span>
      </div>
    </li>
  );
}

export default ModalActionItem;
