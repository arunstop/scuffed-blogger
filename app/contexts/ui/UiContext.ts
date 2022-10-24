import { createContext } from "react";
import { UiContextProps } from "../../../base/data/contexts/UiTypes";

export const UiContext = createContext<UiContextProps>({} as UiContextProps);
