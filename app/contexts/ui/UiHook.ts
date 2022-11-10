import { useContext } from "react";
import { UiContext } from "./UiContext";

export const useUiCtx = () => {
  const { state, action } = useContext(UiContext);
  return { state, action };
};
