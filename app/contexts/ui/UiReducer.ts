import { UiActionTypes, UiState } from "../../../base/data/contexts/UiTypes";

export const UI_REDUCER = (state: UiState, action: UiActionTypes): UiState => {
  const type = action.type;
  switch (type) {
    case "TOGGLE_DARK_MODE": {
      return { ...state, darkMode: action.payload.newVal };
    }
    case "ADD_TOAST": {
      return { ...state, toasts: [...state.toasts, action.payload.toast] };
    }
    case "REMOVE_TOAST": {
      console.log(state.toasts);
      return {
        ...state,
        toasts: state.toasts.filter((e) => e.id !== action.payload.id),
      };
    }
    case "CLEAR_TOASTS": {
      return {
        ...state,
        toasts: [],
      };
    }
    // case "SET_REPLYING_COMMENT_ID": {
    //   return { ...state, replyingCommentId: action.payload.id };
    // }
    default:
      return state;
  }
};
