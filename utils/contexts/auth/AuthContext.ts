import { createContext } from "react";
import { AuthContextProps } from "../../data/contexts/AuthTypes";

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);
