import { ReactNode, useReducer } from "react";
import { UiAction, UiContextProps } from "../../helpers/data/types/UiTypes";
import { UiContext } from "./UiContext";
import { UI_INIT } from "./UiInitializer";
import { UI_REDUCER } from "./UiReducer";

export const UiProvider = ({ children }: { children: ReactNode }) => {
  // reducer
  const [state, dispatch] = useReducer(UI_REDUCER, UI_INIT);
  const action: UiAction = {
    toggleDarkMode: (newVal) => {
      dispatch({ type: "TOGGLE_DARK_MODE", payload: { newVal } });
    },
  };

  const value: UiContextProps = {
    state: state,
    action: action,
  };

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
};
