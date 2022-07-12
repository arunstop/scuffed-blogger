import { useRouter } from "next/router";
import { ReactNode, useEffect, useReducer } from "react";
import { AuthAction, AuthContextProps } from "../../data/contexts/AuthTypes";
import { UserModel } from "../../data/models/UserModel";
import { KEY_AUTH_USER } from "../../helpers/Constants";
import {
  storageCheck,
  storageGet,
  storageRemove,
  storageSave,
} from "../../services/local/LocalStorage";
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
      storageRemove(KEY_AUTH_USER);
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
      const localUserData = storageCheck(KEY_AUTH_USER);
      
      // if not logged in
      if (!user) {
        // delete local user data from previous session (if exist)
        // if not logged in
        if (localUserData) {
          return action.unsetUser();
        }
        return;
      }
      // if logged in
      if (localUserData) {
        // set local user data to the context,
        // if it has the data from the session before
        try {
          // using try catch to avoid data modification
          const localAuthData = JSON.parse(
            decodeURIComponent(storageGet(KEY_AUTH_USER)),
          );
          // set auth data if valid
          action.setUser(localAuthData as UserModel);
        } catch (error) {
          console.log("Error when setting the auth user data",error);
        }
      }
    });
  }, []);

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};
