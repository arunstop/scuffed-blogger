import { CommentModelsWithPaging } from "./../../../base/data/models/CommentModel";
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
      const { replies } = action.payload;
      if (!state.replies) return { ...state, replies: [replies] };
      const filteredReplies = state.replies.filter((e) => {
        return (
          e.comments[0].parentCommentId !== replies.comments[0].parentCommentId
        );
      });
      return {
        ...state,
        replies: [...filteredReplies, replies],
      };
    }
    case "UPDATE_COMMENT": {
      const comment = action.payload.comment;
      if (!state.comments) return state;
      // search and change the comment
      const newComments = state.comments.comments.map((e) => {
        return e.id === comment.id ? comment : e;
      });
      return {
        ...state,
        comments: { ...state.comments, comments: newComments },
      };
    }
    case "UPDATE_REPLY": {
      const reply = action.payload.reply;
      if (!state.replies) return state;
      console.log(state.replies);
      // search and change the reply
      const replyTarget = state.replies.find((e) => {
        return e.comments[0].parentCommentId === reply.parentCommentId;
      });
      if (!replyTarget) return state;
      // change the targeted reply
      const updatedComments = replyTarget.comments.map((e) => {
        return e.id === reply.id ? reply : e;
      });
      const newReplyList: CommentModelsWithPaging = {
        ...replyTarget,
        comments: updatedComments,
      };
      const newReplies = [
        ...state.replies.filter(
          (e) => e.comments[0].parentCommentId !== reply.parentCommentId,
        ),
        newReplyList,
      ];
      return { ...state, replies: newReplies };
    }
    default:
      return state;
  }
};
