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
import { autoRetry } from "../../helpers/MainHelpers";
import {
  serviceCommentAdd,
  serviceCommentDelete,
  serviceCommentGet,
  serviceCommentReact,
  serviceCommentReplyAdd,
  serviceCommentReplyDelete,
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
    console.log("commentsFromDb", commentsFromDb);
    if (!commentsFromDb) return console.log("No comments can be loaded");

    dispatch({
      type: "SET_COMMENTS",
      payload: { comments: commentsFromDb, reload: !!newSortingType },
    });

    // setSortedBy(sortBy || sortedBy);
    if (newSortingType)
      dispatch({ type: "SET_SORT", payload: { sort: newSortingType } });
  }

  async function loadReplies(comment: CommentModel, startFrom?: number) {
    const { replies } = state;
    const commentId = comment.id;
    // if this comment is somehow a reply, don't do anything
    if (comment.parentCommentId) return;
    const replyListTarget = replies?.find(
      (e) => e.parentCommentId === commentId,
    );
    const repliesFromDb = await autoRetry(
      async () =>
        await serviceCommentReplyGetByParent({
          data: {
            articleId: comment.articleId,
            parentCommentId: commentId,
            count: 5,
            start: startFrom ?? (replyListTarget?.offset || 0),
          },
        }),
    );
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
    toggleReplies(true, comment.id);
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
    loadComments: loadComments,
    loadReplies: loadReplies,
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
    showOptionModal(paramName, comment) {
      let value = ``;
      // determine if the comment is a parent comment or a reply
      if (!comment.parentCommentId) value = `${comment.id}`;
      else value = `${comment.parentCommentId}.${comment.id}`;

      // example :
      // p.rEXeVao4YDieDb8uQYusVpv8.1665267524169-mm1Ih4TfC4HuVMjR6Ky5ESt9
      router.push(
        {
          query: {
            ...router.query,
            [paramName]: value,
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
      const res = await autoRetry(
        async () => await serviceCommentAdd({ data: { comment: newComment } }),
      );
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
      const res = await autoRetry(
        async () =>
          await serviceCommentReplyAdd({
            data: {
              comment: newReply,
              parentCommentId,
            },
          }),
      );

      if (!res) return null;
      console.log(res.parentComment.replies?.length);
      updateComment(res.parentComment);
      console.log(res.parentComment.replies?.length);
      loadReplies(res.parentComment, 0);

      return res.reply;
    },
    updateComment: updateComment,
    updateReply: updateReply,
    reactComment: async (props) => {
      const newComment = await autoRetry(
        async () =>
          await serviceCommentReact({
            data: props,
          }),
      );
      if (!newComment) return;
      // if the comment is not a reply
      if (!props.comment.parentCommentId) return updateComment(newComment);
      updateReply(newComment);
    },
    toggleReplies: toggleReplies,
    deleteComment: async function (id): Promise<void> {
      if (!state.comments) return;
      const comment = state.comments.comments.find((e) => e.id === id);
      if (!comment) return;
      // console.log(comment);
      const res = await autoRetry(
        async () =>
          await serviceCommentDelete({
            data: {
              articleId: comment.articleId,
              commentId: comment.id,
            },
          }),
      );
      if (!res) return;
      dispatch({
        type: "DELETE_COMMENT",
        payload: {
          comment,
        },
      });
      // reload comments, if only the first page of the comments is loaded
      // console.log(state.comments.comments.length);
      // console.log(state.comments.total);
      if (state.comments.comments.length <= 5 && state.comments.total > 5)
        loadComments(state.comments.sortBy);
    },
    deleteReply: async function (parentCommentId, id): Promise<void> {
      if (!id || !parentCommentId || !state.replies || !state.comments) return;
      const replyTargetIdx = state.replies.findIndex(
        (e) => e.parentCommentId === parentCommentId,
      );
      // console.log(replyTargetIdx);
      if (replyTargetIdx < 0) return;
      const reply = state.replies[replyTargetIdx].comments.find(
        (e) => e.id === id,
      );
      if (!reply) return;
      let parentComment = state.comments.comments.find(
        (e) => e.id === parentCommentId,
      );
      if (!parentComment) return;
      parentComment = {
        ...parentComment,
        replies: (parentComment.replies || []).filter((e) => e !== reply.id),
        dateUpdated: Date.now(),
      };
      const res = await autoRetry(
        async () =>
          await serviceCommentReplyDelete({
            data: {
              reply: reply,
              parentComment: parentComment,
            },
          }),
      );
      if (!res) return;
      updateComment(parentComment);
      dispatch({
        type: "DELETE_REPLY",
        payload: {
          idx: replyTargetIdx,
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
