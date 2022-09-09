import { ApiPagingResultProps } from "./../Main";
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
}

export type CommentModelsWithPaging = {
  comments: CommentModel[];
} & ApiPagingResultProps;

export type CommentModelListPagedSorted = CommentModelsWithPaging & {
  sortBy: CommentModelsSortType;
};

export type CommentModelsSortType = "new" | "top" | "discussed";
