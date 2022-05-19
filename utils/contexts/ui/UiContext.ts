import { createContext } from "react";
import { UiContextProps } from "../../helpers/data/types/UiTypes";

export const UiContext = createContext<UiContextProps>({} as UiContextProps);
