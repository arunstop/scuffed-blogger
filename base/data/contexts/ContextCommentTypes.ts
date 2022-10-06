import {
  CommentModelListPagedSorted,
  CommentModelsSortType,
  CommentModelsWithPaging,
} from "../models/CommentModel";
import { UserModel } from "../models/UserModel";
import { ServiceCommentReactProps } from "./../../../app/services/CommentService";
import { CommentModel } from "./../models/CommentModel";
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
  showReplyModal: (param: string, commentId: string) => void;
  showOptionModal: (param: string, commentId: string) => void;
  addComment: (
    content: string,
    user: UserModel,
  ) => Promise<CommentModel | null>;
  addReply: (props: {
    content: string;
    user: UserModel;
    parentCommentId: string;
  }) => Promise<CommentModel | null>;
  reactComment: (props: ServiceCommentReactProps) => Promise<void>;
  // reactReply: (props:ServiceCommentReactProps) => Promise<void>;
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
