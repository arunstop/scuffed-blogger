import { useContext } from "react";
import { authContext } from "./AuthContext";

export const useAuthCtx = () => {
  const { state, action } = useContext(authContext);
  return { authState: state, authAction: action, loggedIn: !!state.user };
};
