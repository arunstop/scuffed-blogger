import { useContext } from "react";
import { WritingPanelContext } from "./WritingPanelContext";

export const useWritingPanelCtx = () => {
  const { state, action } = useContext(WritingPanelContext);
  return { state,action };
};
