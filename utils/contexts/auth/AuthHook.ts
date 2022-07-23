import { useContext } from "react";
import { authContext } from "./AuthContext";

export const useAuthCtx = () => {
  const { state, action } = useContext(authContext);
  return { authStt: state, authAct: action, isLoggedIn: !!state.user };
};
