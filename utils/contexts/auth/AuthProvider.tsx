import { ReactNode, useEffect, useReducer } from "react";
import { AuthAction, AuthContextProps } from "../../data/contexts/AuthTypes";
import { firebaseClient } from "../../services/network/FirebaseClient";
import { authContext } from "./AuthContext";
import { AUTH_INIT } from "./AuthInitializer";
import { authReducer } from "./AuthReducer";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // reducer
  const [state, dispatch] = useReducer(authReducer, AUTH_INIT);
  const action: AuthAction = {
    setUser: (user) => {
      dispatch({ type: "SET_USER", payload: { user } });
      // toggleClientDarkMode(newVal);
    },
    unsetUser: () => {
      dispatch({ type: "UNSET_USER" });
    },
    // setReplyingCommentId: (id) => {
    //   dispatch({ type: "SET_REPLYING_COMMENT_ID", payload: { id } });
    // },
  };

  const value: AuthContextProps = {
    state: state,
    action: action,
  };

  useEffect(() => {
    firebaseClient.auth.onAuthStateChanged((user) => {
      if (user) action.setUser(user);
    });
  }, []);

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};
