import { useRouter } from "next/router";
import { ReactNode, useEffect, useReducer } from "react";
import { AuthAction, AuthContextProps } from "../../data/contexts/AuthTypes";
import { UserModel } from "../../data/models/UserModel";
import { KEY_AUTH_USER } from "../../helpers/Constants";
import { storageFind, storageSave } from "../../services/local/LocalStorage";
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
      storageSave(KEY_AUTH_USER, encodeURIComponent(JSON.stringify(user)));
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
    try {
      const localAuthUser = JSON.parse(
        decodeURIComponent(storageFind(KEY_AUTH_USER)),
      );
      action.setUser(localAuthUser as UserModel);
    } catch (error) {
      console.log("no local user auth");
    }
  }, []);

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};
