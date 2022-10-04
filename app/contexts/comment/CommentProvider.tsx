import { ReactNode, useReducer } from "react";
import {
  ContextCommentActions,
  ContextCommentTypes,
} from "../../../base/data/contexts/ContextCommentTypes";
import { CommentModel } from "../../../base/data/models/CommentModel";
import {
  serviceCommentGet,
  serviceCommentReplyGetByParent,
} from "../../services/CommentService";
import { CommentContext } from "./CommentContext";
import { CONTEXT_COMMENT_INIT } from "./CommentInitializer";
import { commentReducer } from "./CommentReducer";

export const CommentProvider = ({
  articleId,
  children,
}: {
  articleId: string;
  children: ReactNode;
}) => {
  // reducer
  const [state, dispatch] = useReducer(commentReducer, {
    ...CONTEXT_COMMENT_INIT,
    articleId: articleId,
  });
  const action: ContextCommentActions = {
    async loadComments(newSortingType) {
      const { articleId, comments: commentList, sort } = state;
      // define where to start
      // console.log('123');
      const startFrom =
        !!newSortingType || !commentList ? 0 : commentList.offset;
      const commentsFromDb = await serviceCommentGet({
        data: {
          articleId,
          start: startFrom,
          count: 5,
          sortBy: newSortingType || commentList?.sortBy || sort,
        },
      });
      // console.log("commentsFromDb", commentsFromDb);
      if (!commentsFromDb) return console.log("No comments can be loaded");

      dispatch({
        type: "SET_COMMENTS",
        payload: { comments: commentsFromDb },
      });

      // setSortedBy(sortBy || sortedBy);
      if (newSortingType)
        dispatch({ type: "SET_SORT", payload: { sort: newSortingType } });
    },
    async loadReplies(comment, startFrom) {
      const { replies } = state;
      // if this comment is somehow a reply, don't do anything
      if (comment.parentCommentId) return;
      const replyListTarget = replies?.find(
        (e) => e.comments[0].parentCommentId === comment.id,
      );
      const repliesFromDb = await serviceCommentReplyGetByParent({
        data: {
          articleId: comment.articleId,
          parentCommentId: comment.id,
          count: 5,
          start: startFrom ?? (replyListTarget?.offset || 0),
        },
      });
      if (!repliesFromDb) return console.log("no replies for some reason");
      dispatch({ type: "SET_REPLIES", payload: { replies: repliesFromDb } });
      console.log(repliesFromDb);
    },
    showReplyModal(commentId: string) {
      throw new Error("Function not implemented.");
    },
    showOptionModal(commentId: string) {
      throw new Error("Function not implemented.");
    },
    reply() {
      throw new Error("Function not implemented.");
    },
    comment() {
      throw new Error("Function not implemented.");
    },
    async updateComment(comment: CommentModel) {
      dispatch({
        type: "UPDATE_COMMENT",
        payload: {
          comment: comment,
        },
      });
    },
    async updateReply(reply: CommentModel) {
      dispatch({
        type: "UPDATE_REPLY",
        payload: {
          reply: reply,
        },
      });
    },
  };

  const value: ContextCommentTypes = {
    state: state,
    action: action,
  };

  return (
    <CommentContext.Provider value={value}>{children}</CommentContext.Provider>
  );
};
