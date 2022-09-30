import { ReactNode, useEffect, useReducer } from "react";
import { UiAction, UiContextProps } from "../../../base/data/contexts/UiTypes";
import {
  initClientDarkMode,
  toggleClientDarkMode,
} from "../../helpers/UiHelpers";
import { UiContext } from "./UiContext";
import { UI_INIT } from "./UiInitializer";
import { UI_REDUCER } from "./UiReducer";

export const UiProvider = ({ children }: { children: ReactNode }) => {
  // reducer
  const [state, dispatch] = useReducer(UI_REDUCER, UI_INIT);
  const action: UiAction = {
    toggleDarkMode: (newVal) => {
      dispatch({ type: "TOGGLE_DARK_MODE", payload: { newVal } });
      toggleClientDarkMode(newVal);
    },
    // setReplyingCommentId: (id) => {
    //   dispatch({ type: "SET_REPLYING_COMMENT_ID", payload: { id } });
    // },
  };

  const value: UiContextProps = {
    state: state,
    action: action,
  };

  useEffect(() => {
    initClientDarkMode(action.toggleDarkMode);
  }, []);

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
};
