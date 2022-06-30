import { createContext } from "react";
import { AuthContextProps } from "../../data/contexts/AuthTypes";

export const authContext = createContext<AuthContextProps>({} as AuthContextProps);
