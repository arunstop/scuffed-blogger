import router from "next/router";
import { ReactNode, useReducer } from "react";
import {
  ContextCommentActions,
  ContextCommentTypes,
} from "../../../base/data/contexts/ContextCommentTypes";
import {
  CommentModel,
  CommentModelsSortType,
  factoryCommentComplete,
} from "../../../base/data/models/CommentModel";
import {
  serviceCommentAdd,
  serviceCommentGet,
  serviceCommentReact,
  serviceCommentReplyAdd,
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

  async function loadComments(newSortingType?: CommentModelsSortType) {
    const { articleId, comments: commentList, sort } = state;
    // define where to start
    // console.log('123');
    const startFrom = !!newSortingType || !commentList ? 0 : commentList.offset;
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
  }
  async function updateComment(comment: CommentModel) {
    dispatch({
      type: "UPDATE_COMMENT",
      payload: {
        comment: comment,
      },
    });
  }
  async function updateReply(reply: CommentModel) {
    dispatch({
      type: "UPDATE_REPLY",
      payload: {
        reply: reply,
      },
    });
  }
  function toggleReplies(value: boolean, parentCommentId: string): void {
    dispatch({
      type: "TOGGLE_REPLIES",
      payload: {
        value,
        parentCommentId,
      },
    });
  }

  const action: ContextCommentActions = {
    loadComments,
    async loadReplies(comment, startFrom) {
      const { replies } = state;
      const commentId = comment.id;
      // if this comment is somehow a reply, don't do anything
      if (comment.parentCommentId) return;
      const replyListTarget = replies?.find(
        (e) => e.parentCommentId === commentId,
      );
      const repliesFromDb = await serviceCommentReplyGetByParent({
        data: {
          articleId: comment.articleId,
          parentCommentId: commentId,
          count: 5,
          start: startFrom ?? (replyListTarget?.offset || 0),
        },
      });
      if (!repliesFromDb) return console.log("no replies for some reason");
      // setting replies
      dispatch({
        type: "SET_REPLIES",
        payload: {
          replies: {
            ...repliesFromDb,
            parentCommentId: commentId,
          },
        },
      });
      // showing the replies
      toggleReplies(true,comment.id);
    },
    showReplyModal: (param, commentId) => {
      router.push(
        {
          query: {
            ...router.query,
            [param]: commentId,
          },
        },
        undefined,
        { shallow: true },
      );
    },
    showOptionModal(param, commentId) {
      router.push(
        {
          query: {
            ...router.query,
            [param]: commentId,
          },
        },
        undefined,
        { shallow: true },
      );
    },
    async addComment(content, user) {
      const newComment = factoryCommentComplete({
        content: encodeURIComponent(content.trim()),
        articleId: state.articleId,
        userId: user.id,
        userName: user.name,
        upvote: [user.id],
      });
      const res = await serviceCommentAdd({ data: { comment: newComment } });
      loadComments("new");
      if (!res) return null;
      return newComment;
    },
    async addReply(props) {
      const { content, user, parentCommentId } = props;
      const newReply = factoryCommentComplete({
        content: encodeURIComponent(content.trim()),
        articleId: state.articleId,
        parentCommentId: parentCommentId,
        userId: user.id,
        userName: user.name,
        upvote: [user.id],
      });
      const res = await serviceCommentReplyAdd({
        data: {
          comment: newReply,
          parentCommentId,
        },
      });
      loadComments("new");
      if (!res) return null;
      return newReply;
    },
    updateComment,
    updateReply,
    reactComment: async (props) => {
      const newComment = await serviceCommentReact({
        data: props,
      });
      if (!newComment) return;
      // if the comment is not a reply
      if (!props.comment.parentCommentId) return updateComment(newComment);
      updateReply(newComment);
    },
    toggleReplies,
  };

  const value: ContextCommentTypes = {
    state: state,
    action: action,
  };

  return (
    <CommentContext.Provider value={value}>{children}</CommentContext.Provider>
  );
};
