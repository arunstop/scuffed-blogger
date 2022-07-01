import { createContext } from "react";
import { UiContextProps } from "../../data/contexts/UiTypes";

export const UiContext = createContext<UiContextProps>({} as UiContextProps);
