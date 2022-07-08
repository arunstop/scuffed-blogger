import { UserModel } from "../models/UserModel";
export interface AuthContextProps {
  state: AuthState;
  action: AuthAction;
}

export interface AuthState {
  user: UserModel|null;
}

export interface AuthAction {
  setUser: (user: UserModel) => void;
  unsetUser: () => void;
  // setReplyingCommentId: (id: string | number|null) => void;
}

export type AuthActionTypes =
  | {
      type: "SET_USER";
      payload: { user: UserModel };
    }
  | {
      type: "UNSET_USER";
      //   payload: { };
    };
// | {
//     type: "SET_REPLYING_COMMENT_ID";
//     payload: { id: string | number | null };
//   };
