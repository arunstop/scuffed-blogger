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
  upvote : number;
  downvote:number;
}

export type CommentModelsWithPaging = {
  comments: CommentModel[];
} & ApiPagingResultProps;