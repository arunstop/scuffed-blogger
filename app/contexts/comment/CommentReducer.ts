import { ContextCommentActionTypes } from "./../../../base/data/contexts/ContextCommentTypes";
import { ContextCommentStates } from "../../../base/data/contexts/ContextCommentTypes";

export const commentReducer = (
  state: ContextCommentStates,
  action: ContextCommentActionTypes,
): ContextCommentStates => {
  const type = action.type;
  switch (type) {
    case "SET_COMMENTS": {
      return { ...state, comments: action.payload.comments };
    }
    case "SET_REPLIES": {
      return { ...state, replies: action.payload.replies };
    }
    case "UPDATE_COMMENT": {
      const comment = action.payload.comment;
      if (!state.comments) return state;
      const res = state.comments.comments.map((e) => {
        return e.id === comment.id ? comment : e;
      });
      return { ...state, comments: { ...state.comments, comments: res } };
    }
    case "UPDATE_REPLY": {
      const reply = action.payload.reply;
      if (!state.replies) return state;
      const res = state.replies.comments.map((e) => {
        return e.id === reply.id ? reply : e;
      });
      return { ...state, replies: { ...state.replies, comments: res } };
    }
    default:
      return state;
  }
};
