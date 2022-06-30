import { useRouter } from "next/router";
import { ReactNode, useEffect, useReducer } from "react";
import { AuthAction, AuthContextProps } from "../../data/contexts/AuthTypes";
import { firebaseAuth } from "../../services/network/FirebaseClient";
import { authContext } from "./AuthContext";
import { AUTH_INIT } from "./AuthInitializer";
import { authReducer } from "./AuthReducer";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  // reducer
  const [state, dispatch] = useReducer(authReducer, AUTH_INIT);
  const action: AuthAction = {
    setUser: (user) => {
      dispatch({ type: "SET_USER", payload: { user } });
      // toggleClientDarkMode(newVal);
    },
    unsetUser: () => {
      dispatch({ type: "UNSET_USER" });
      firebaseAuth.signOut();
      router.push("/auth");
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
    firebaseAuth.onAuthStateChanged((user) => {
      if (user) return action.setUser(user);
    });
  }, []);

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};
