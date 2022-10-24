import { useUiCtx } from "../../../app/contexts/ui/UiHook";
import { ModalProps } from "../../../base/data/Main";
import ModalActionTemplate from "./ModalActionTemplate";

interface ModalConfirmationProps {
  title: string;
  desc: string;
  onConfirm: () => void;
  labelOk?: string;
  labelCancel?: string;
}

function ModalConfirmation({
  value,
  onClose,
  title,
  desc,
  onConfirm,
  labelOk = "Ok",
  labelCancel = "Cancel",
}: ModalProps & ModalConfirmationProps) {
  const { uiAct } = useUiCtx();
  return (
    <ModalActionTemplate
      value={value}
      onClose={onClose}
      title={title}
      desc={desc}
      confirmations={[
        {
          label: labelOk,
          action: () => {
            onConfirm();
            uiAct.addToast({
              label: "Article successfully deleted",
              type:"success",
            });
          },
          className: "!btn-primary",
        },
        { label: labelCancel, action: onClose, className: "btn-" },
      ]}
    ></ModalActionTemplate>
  );
}

export default ModalConfirmation;
