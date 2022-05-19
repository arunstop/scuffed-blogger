import { createContext } from "react";
import { UiContextProps } from "../../data/types/UiTypes";

export const UiContext = createContext<UiContextProps>({} as UiContextProps);
