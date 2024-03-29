import {
  CommentModel,
  CommentModelListPagedSorted,
} from "./../../../base/data/models/CommentModel";
import { ContextCommentStates } from "../../../base/data/contexts/ContextCommentTypes";
import {
  CommentContextReplyState,
  ContextCommentActionTypes,
} from "./../../../base/data/contexts/ContextCommentTypes";

export const commentReducer = (
  state: ContextCommentStates,
  action: ContextCommentActionTypes,
): ContextCommentStates => {
  const type = action.type;
  switch (type) {
    case "SET_COMMENTS": {
      const { comments, reload } = action.payload;
      // just add the comments from payload if comments state is empty
      if (!state.comments || reload)
        return { ...state, comments: action.payload.comments };
      const stateComments = state.comments;
      // re-set comments state if sorting methods are different
      if (stateComments.sortBy !== comments.sortBy)
        return { ...state, comments: action.payload.comments };
      // append comments in the comments state if they are the same
      const newCommentList: CommentModel[] = [
        ...stateComments.comments,
        ...comments.comments,
      ];
      const newCommentsState: CommentModelListPagedSorted = {
        ...stateComments,
        comments: newCommentList,
        offset: comments.offset,
      };
      // console.log('newCommentState',newCommentsState.comments.map((e)=>e.id));
      return { ...state, comments: newCommentsState };
    }
    case "SET_REPLIES": {
      const { replies } = action.payload;
      if (!state.replies) return { ...state, replies: [replies] };
      const filteredReplies = state.replies.filter((e) => {
        return e.parentCommentId !== replies.parentCommentId;
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
      // search and change the reply
      const replyTarget = state.replies.find((e) => {
        return e.parentCommentId === reply.parentCommentId;
      });
      if (!replyTarget) return state;
      // change the targeted reply
      const updatedComments = replyTarget.comments.map((e) => {
        return e.id === reply.id ? reply : e;
      });
      const newReplyList: CommentContextReplyState = {
        ...replyTarget,
        comments: updatedComments,
      };
      const newReplies = [
        ...state.replies.filter(
          (e) => e.parentCommentId !== reply.parentCommentId,
        ),
        newReplyList,
      ];
      return { ...state, replies: newReplies };
    }
    case "TOGGLE_REPLIES": {
      const { value, parentCommentId } = action.payload;
      let newShownReplies;
      if (!value)
        newShownReplies = state.shownReplies.filter(
          (e) => e !== parentCommentId,
        );
      else newShownReplies = [...state.shownReplies, parentCommentId];
      return { ...state, shownReplies: newShownReplies };
    }
    case "DELETE_COMMENT": {
      const { comment } = action.payload;
      if (!state.comments) return state;
      const newComments = state.comments.comments.filter(
        (e) => e.id !== comment.id,
      );
      const newReplies = state.replies?.filter(
        (e) => e.parentCommentId !== comment.id,
      );
      const newShownReplies = state.shownReplies.filter(
        (e) => e !== comment.id,
      );
      return {
        ...state,
        comments: {
          ...state.comments,
          comments: newComments,
          total: state.comments.total - 1,
        },
        replies: newReplies,
        shownReplies: newShownReplies,
      };
    }
    case "DELETE_REPLY": {
      const { idx, reply } = action.payload;
      if (!state.replies || idx >= state.replies.length) return state;
      const repliesTarget = state.replies[idx];
      // removing the reply from the state
      repliesTarget.comments = repliesTarget.comments.filter(
        (e) => e.id !== reply.id,
      );
      repliesTarget.total = repliesTarget.total - 1;

      const newReplies: CommentContextReplyState[] = [
        ...state.replies.splice(idx, 1), // removing the old obsolete target
        repliesTarget, // added the updated value
      ];

      return {
        ...state,
        replies: newReplies,
      };
    }
    default:
      return state;
  }
};
