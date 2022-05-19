export interface UiContextProps {
  state: UiState;
  action: UiAction;
}

export interface UiState {
  darkMode: boolean;
}

export interface UiAction {
  toggleDarkMode: (newVal: boolean) => void;
}

export type UiActionTypes = {
  type: "TOGGLE_DARK_MODE";
  payload: { newVal: boolean };
};
