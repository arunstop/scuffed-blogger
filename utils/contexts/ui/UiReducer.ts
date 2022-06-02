import { UiActionTypes, UiState } from "../../data/types/UiTypes";

export const UI_REDUCER = (state: UiState, action: UiActionTypes): UiState => {
  const type = action.type;
  switch (type) {
    case "TOGGLE_DARK_MODE": {
      return { ...state, darkMode: action.payload.newVal };
    }
    // case "SET_REPLYING_COMMENT_ID": {
    //   return { ...state, replyingCommentId: action.payload.id };
    // }
    default:
      return state;
  }
};
