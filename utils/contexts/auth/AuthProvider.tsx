import { useRouter } from "next/router";
import { destroyCookie, setCookie } from "nookies";
import { ReactNode, useEffect, useReducer } from "react";
import { AuthAction, AuthContextProps } from "../../data/contexts/AuthTypes";
import { UserModel } from "../../data/models/UserModel";
import { COOKIE_AUTH_USER } from "../../helpers/Constants";
import { firebaseAuth } from "../../services/network/FirebaseClient";
import { AuthContext } from "./AuthContext";
import { authReducer } from "./AuthReducer";

export const AuthProvider = ({
  children,
  initUser,
}: {
  children: ReactNode;
  initUser?: UserModel;
}) => {
  const router = useRouter();
  // reducer
  const [state, dispatch] = useReducer(authReducer, {
    user: initUser || null,
  });
  // actions
  const action: AuthAction = {
    setUser: (user) => {
      // update state
      dispatch({ type: "SET_USER", payload: { user } });
      // set cookie
      const strUser = encodeURIComponent(JSON.stringify(user));
      setCookie(undefined, COOKIE_AUTH_USER, strUser, {
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
      });
    },
    unsetUser: () => {
      // unset user in context
      dispatch({ type: "UNSET_USER" });
      // signout firebase
      firebaseAuth.signOut();
      // destroy cookie
      destroyCookie(undefined, COOKIE_AUTH_USER);
      // navigate to auth
      router.push("/auth");
    },
  };

  const value: AuthContextProps = {
    state: state,
    action: action,
  };

  useEffect(() => {
    firebaseAuth.onAuthStateChanged((user) => {
      const localUserData = initUser;

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
        // update firebase user props from auth data instead of the obsolete firestore
        action.setUser({ ...localUserData, firebaseUser: user });
      }
    });
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
