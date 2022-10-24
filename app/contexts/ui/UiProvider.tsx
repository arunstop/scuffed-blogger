import { ReactNode, useEffect, useReducer } from "react";
import {
  UiAction,
  UiContextProps,
  UiToast,
} from "../../../base/data/contexts/UiTypes";
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
    addToast: function (toast: UiToast): void {
      dispatch({ type: "ADD_TOAST", payload: { toast: toast } });
    },
    removeToast: function (id: string): void {
      dispatch({ type: "REMOVE_TOAST", payload: { id: id } });
    },
    clearToasts: function (): void {
      dispatch({ type: "CLEAR_TOASTS" });
    },
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
