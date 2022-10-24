export interface UiToast {
  id:string;
  label: string;
  action?: () => void;
  onClose?: () => void;
}
export interface UiContextProps {
  state: UiState;
  action: UiAction;
}

export interface UiState {
  darkMode: boolean;
  replyingCommentId?: string | number | null;
  toasts: UiToast[];
}

export interface UiAction {
  toggleDarkMode: (newVal: boolean) => void;
  addToast: (toast:UiToast) => void;
  removeToast: (id:string) => void;
  clearToasts:()=>void;
  // setReplyingCommentId: (id: string | number|null) => void;
}

export type UiActionTypes =
  | {
      type: "TOGGLE_DARK_MODE";
      payload: { newVal: boolean };
    }
  | {
      type: "ADD_TOAST";
      payload: { toast: UiToast };
    }
  | {
      type: "REMOVE_TOAST";
      payload: { id: string };
    }|{
      type: "CLEAR_TOASTS";
    };
// | {
//     type: "SET_REPLYING_COMMENT_ID";
//     payload: { id: string | number | null };
//   };
