import { createContext } from "react";
import { WritingPanelContextProps } from "../../data/contexts/WritingPanelTypes";

export const WritingPanelContext = createContext<WritingPanelContextProps>({} as WritingPanelContextProps);
