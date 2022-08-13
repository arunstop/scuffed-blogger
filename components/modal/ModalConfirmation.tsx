import React from "react";
import { ModalProps } from "../../utils/data/Main";
import ModalTemplate from "./ModalTemplate";

interface ModalConfirmationProps {
  title: string;
  desc: string;
  onConfirm: () => void;
}

function ModalConfirmation({
  value,
  onClose,
  title,
  desc,

  onConfirm,
}: ModalProps & ModalConfirmationProps) {
  return (
    <ModalTemplate value={value} onClose={onClose} title={title}>
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* desc */}
        <div>{desc}</div>
        {/* actions */}
        {/* using reverse because when the user hits enter, the yes button should be pressed */}
        <div className="flex gap-2 sm:gap-4 w-full flex-col-reverse sm:flex-row-reverse">
          <button
            className="flex-1 btn --btn-resp btn-primary font-bold"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            className="flex-1 btn --btn-resp btn-outline font-bold"
            onClick={onClose}
          >
            No
          </button>
        </div>
      </div>
    </ModalTemplate>
  );
}

export default ModalConfirmation;
