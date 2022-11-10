import { createContext } from "react";
import { WritingPanelContextProps } from "../../../base/data/contexts/WritingPanelTypes";

export const WritingPanelContext = createContext<WritingPanelContextProps>({} as WritingPanelContextProps);
