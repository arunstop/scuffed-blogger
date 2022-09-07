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
}

export type CommentModelWithPaging = {
  comments: CommentModel[];
} & ApiPagingResultProps;
