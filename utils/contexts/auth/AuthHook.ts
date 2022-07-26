import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const useAuthCtx = () => {
  const { state, action } = useContext(AuthContext);
  return { authStt: state, authAct: action, isLoggedIn: !!state.user };
};
