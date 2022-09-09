import { useRouter } from "next/router";
import { destroyCookie, setCookie } from "nookies";
import { ReactNode, useEffect, useReducer } from "react";
import { AuthAction, AuthContextProps } from "../../data/contexts/AuthTypes";
import { UserModel } from "../../data/models/UserModel";
import { COOKIE_USER_AUTH } from "../../helpers/Constants";
import { fbUserGet } from "../../services/network/FirebaseApi/UserModules";
import { firebaseAuth } from "../../services/network/FirebaseClient";
import {
  rtdbSessionAdd
} from "../../services/network/RtdbModules";
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
      // set auth data cookie
      const strUser = JSON.stringify(user);
      // setting cookie, which is already encoded
      setCookie(undefined, COOKIE_USER_AUTH, strUser, {
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
      });
      // // set session cookie
      // const strSession = encodeURIComponent(JSON.stringify(user.session));
      // setCookie(undefined, COOKIE_USER_AUTH_SESSION, strSession, {
      //   path: "/",
      //   maxAge: 30 * 24 * 60 * 60,
      // });
    },
    unsetUser: () => {
      // unset user in context
      dispatch({ type: "UNSET_USER" });
      // signout firebase
      firebaseAuth.signOut();
      // destroy cookie auth data
      destroyCookie(undefined, COOKIE_USER_AUTH, {
        path: "/",
      });
      // destroy cookie auth session
      // destroyCookie(undefined, COOKIE_USER_AUTH_SESSION);
      // navigate to auth
      router.push("/auth");
    },
  };

  const value: AuthContextProps = {
    state: state,
    action: action,
  };

  useEffect(() => {
    firebaseAuth.onAuthStateChanged(async (user) => {
      const localUserData = initUser;
      // console.log(localUserData);

      // if not logged in
      if (!user) {
        // delete local user data from previous session (if exist)
        // if not logged in
        if (localUserData) {
          return action.unsetUser();
        }
        return;
      }

      // if logged in & has localUserData
      if (localUserData) {
        // check if data has changed
        // by comparing lastLoginAt on auth database and local machine
        // console.log((user.metadata as any).lastLoginAt);

        // console.log((localUserData?.localAuthData as any).lastLoginAt);

        if (
          (user.metadata as any).lastLoginAt !==
          (localUserData?.localAuthData as any).lastLoginAt
        ) {
          // getting new data
          // console.log("getting new data");
          const newUserData = await fbUserGet({ email: localUserData.email });

          // if failed getting user data
          if (!newUserData) return action.unsetUser();
          const userWithNewSession = await rtdbSessionAdd({
            ...newUserData,
            localAuthData: user,
          });
          return action.setUser(userWithNewSession);
        }
        // update firebase user props from auth data instead of the obsolete firestore
        return action.setUser({ ...localUserData, localAuthData: user });
      }
    });
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
