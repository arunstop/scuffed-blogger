import { createContext } from "react";
import { AuthContextProps } from "../../../base/data/contexts/AuthTypes";

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);
