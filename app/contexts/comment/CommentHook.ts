import { useContext } from "react";
import { CommentContext } from "./CommentContext";

export const useCommentCtx = () => {
  const { state, action } = useContext(CommentContext);
  return { state, action };
};
