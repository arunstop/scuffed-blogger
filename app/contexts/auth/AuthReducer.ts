import { AuthActionTypes, AuthState } from "../../../base/data/contexts/AuthTypes";

export const authReducer = (
  state: AuthState,
  action: AuthActionTypes,
): AuthState => {
  const type = action.type;
  switch (type) {
    case "SET_USER": {
      return { ...state, user: action.payload.user };
    }
    case "UNSET_USER": {
      return { ...state, user: null };
    }
    // case "SET_REPLYING_COMMENT_ID": {
    //   return { ...state, replyingCommentId: action.payload.id };
    // }
    default:
      return state;
  }
};
