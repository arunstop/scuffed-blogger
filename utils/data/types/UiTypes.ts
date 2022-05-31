export interface UiContextProps {
  state: UiState;
  action: UiAction;
}

export interface UiState {
  darkMode: boolean;
  replyingCommentId?: string | number | null;
}

export interface UiAction {
  toggleDarkMode: (newVal: boolean) => void;
  setReplyingCommentId: (id: string | number|null) => void;
}

export type UiActionTypes =
  | {
      type: "TOGGLE_DARK_MODE";
      payload: { newVal: boolean };
    }
  | {
      type: "SET_REPLYING_COMMENT_ID";
      payload: { id: string | number|null };
    };
