import { User } from "firebase/auth";
export interface AuthContextProps {
  state: AuthState;
  action: AuthAction;
}

export interface AuthState {
  user: User|null;
}

export interface AuthAction {
  setUser: (user: User) => void;
  unsetUser: () => void;
  // setReplyingCommentId: (id: string | number|null) => void;
}

export type AuthActionTypes =
  | {
      type: "SET_USER";
      payload: { user: User };
    }
  | {
      type: "UNSET_USER";
      //   payload: { };
    };
// | {
//     type: "SET_REPLYING_COMMENT_ID";
//     payload: { id: string | number | null };
//   };
