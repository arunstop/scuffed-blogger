import { useCallback, useState } from "react";
import { ActionModalActionConfirmation } from "../../components/main/ActionModalTemplate";

function useOptionModalConfirmationHook() {
  const [confirmation, setConfirmation] =
    useState<ActionModalActionConfirmation | null>(null);
  const closeConfirmation = useCallback(() => {
    setConfirmation(null);
  }, []);
  const openConfirmation = useCallback(
    (value: ActionModalActionConfirmation) => {
      setConfirmation(value);
    },
    [],
  );

  return {
    confirmation,
    openConfirmation,
    closeConfirmation,
  };
}

export default useOptionModalConfirmationHook;
