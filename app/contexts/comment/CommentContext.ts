import { createContext } from "react";
import { ContextCommentTypes } from "../../../base/data/contexts/ContextCommentTypes";

export const CommentContext = createContext<ContextCommentTypes>(
  {} as ContextCommentTypes,
);
