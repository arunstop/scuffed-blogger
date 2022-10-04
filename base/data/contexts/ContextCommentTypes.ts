import { CommentModel } from "./../models/CommentModel";
import {
  CommentModelListPagedSorted,
  CommentModelsSortType,
  CommentModelsWithPaging,
} from "../models/CommentModel";
import { ContextTypes } from "./ContextTypes";

export type ContextCommentTypes = ContextTypes<
  ContextCommentStates,
  ContextCommentActions
>;

export interface ContextCommentStates {
  articleId: string;
  comments?: CommentModelListPagedSorted;
  sort: CommentModelsSortType;
  replies?: CommentModelsWithPaging[];
}

export interface ContextCommentActions {
  loadComments: (newSortingType?: CommentModelsSortType) => Promise<void>;
  loadReplies: (comment: CommentModel, startFrom?: number) => Promise<void>;
  showReplyModal: (commentId: string) => void;
  showOptionModal: (commentId: string) => void;
  reply: () => void;
  comment: () => void;
  updateComment: (comment: CommentModel) => Promise<void>;
  updateReply: (reply: CommentModel) => Promise<void>;
  // delet:()=>void;
  // setReplyingCommentId: (id: string | number|null) => void;
}

export type ContextCommentActionTypes =
  | {
      type: "SET_COMMENTS";
      payload: { comments: CommentModelListPagedSorted };
    }
  | {
      type: "SET_REPLIES";
      payload: { replies: CommentModelsWithPaging };
    }
  | {
      type: "SET_SORT";
      payload: { sort: CommentModelsSortType };
    }
  | {
      type: "UPDATE_COMMENT";
      payload: { comment: CommentModel };
    }
  | {
      type: "UPDATE_REPLY";
      payload: { reply: CommentModel };
    };
// | { type: "SHOW_REPLY_MODAL"; payload: { commentId: string } }
// | { type: "SHOW_OPTION_MODAL"; payload: { commentId: string } };
// | {
//     type: "SET_REPLYING_COMMENT_ID";
//     payload: { id: string | number | null };
//   };
