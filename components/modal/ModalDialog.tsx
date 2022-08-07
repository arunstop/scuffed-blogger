import React from "react";
import { MainModalProps } from "../../utils/data/Main";
import ModalTemplate from "../main/ModalTemplate";

interface ModalDialogProps {
  title: string;
  desc: string;
  actionY?: () => void;
  actionN?: () => void;
}

function ModalDialog({
  value,
  onClose,
  title,
  desc,
  actionN = () => {},
  actionY = () => {},
}: MainModalProps & ModalDialogProps) {
  return (
    <ModalTemplate value={value} onClose={onClose} title={title}>
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* desc */}
        <div>{desc}</div>
        {/* actions */}
        <div className="flex gap-2 sm:gap-4 w-full flex-col sm:flex-row">
          <button
            className="flex-1 btn --btn-resp btn-outline font-bold"
            onClick={() => actionN()}
          >
            No
          </button>
          <button
            className="flex-1 btn --btn-resp btn-primary font-bold"
            onClick={() => actionY()}
          >
            Yes
          </button>
        </div>
      </div>
    </ModalTemplate>
  );
}

export default ModalDialog;
