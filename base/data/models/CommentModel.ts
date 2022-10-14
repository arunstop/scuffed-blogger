import { nanoid } from "nanoid";
import { ApiPagingResultProps } from "../Main";
export interface CommentModel {
  id: string;
  content: string;
  dateAdded: number;
  dateUpdated: number;
  updated: boolean;
  articleId: string;
  userId: string;
  userName: string;
  upvote?: string[];
  downvote?: string[];
  parentCommentId?: string;
  replies?: string[];
}

export type CommentModelsWithPaging = {
  comments: CommentModel[];
} & ApiPagingResultProps;

export type CommentModelListPagedSorted = CommentModelsWithPaging & {
  sortBy: CommentModelsSortType;
};

export type CommentModelsSortType = "new" | "top" | "discussed";

export function factoryCommentComplete(
  partial: Partial<CommentModel>,
): CommentModel {
  const dateNow = Date.now();
  return {
    id: partial.id || `${dateNow}-${nanoid(24)}`,
    content: partial.content || ``,
    dateAdded: partial.dateAdded || dateNow,
    dateUpdated: partial.dateUpdated || dateNow,
    updated: partial.updated || false,
    articleId: partial.articleId || ``,
    userId: partial.userId || ``,
    userName: partial.userName || ``,
    upvote: partial.upvote,
    downvote: partial.downvote,
    parentCommentId: partial.parentCommentId,
    replies: partial.replies,
  };
}
