import { useCallback, useState } from "react";
import { ModalActionConfirmation } from "../../ui/components/modal/ModalActionTemplate";

function useOptionModalConfirmationHook() {
  const [confirmation, setConfirmation] = useState<{
    show: boolean;
    data?: ModalActionConfirmation;
  }>({ show: false });

  const close = useCallback(() => {
    if(confirmation.show===false) return;
    // console.log(confirmation.data);
    setConfirmation({ show: false, data: confirmation.data });
  }, [confirmation]);
  const open = useCallback(
    (value: ModalActionConfirmation | undefined) => {
      // setShow(true);
      setConfirmation({ show: true, data: value });
    },
    [],
  );

  return {
    ...confirmation,
    // show,
    open,
    close,
    // clear,
  };
}

export default useOptionModalConfirmationHook;
