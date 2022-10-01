import { FirebaseError } from "firebase/app";
import {
  MainApiResponse,
  netSuccess,
  netError,
  ApiPagingReqProps,
} from "../../base/data/Main";
import {
  CommentModel,
  CommentModelsSortType,
  CommentModelsWithPaging,
  CommentModelListPagedSorted,
} from "../../base/data/models/CommentModel";
import {
  repoRtCommentAdd,
  repoRtCommentGet,
  repoRtCommentUpdate,
  repoRtCommentReact,
  repoRtCommentDelete,
} from "../../base/repos/realtimeDb/RealtimeCommentRepo";

export async function fbCommentAdd({
  data,
  callback,
}: MainApiResponse<
  { comment: CommentModel },
  CommentModel | null | FirebaseError
>): Promise<boolean> {
  const { comment } = data;
  try {
    await repoRtCommentAdd({
      comment: comment,
    });
    callback?.(netSuccess("Success adding comment", comment));
    return true;
  } catch (error) {
    callback?.(netError("Error when adding comment", error as FirebaseError));
    return false;
  }
}

export async function fbCommentGet({
  data,
  callback,
}: MainApiResponse<
  {
    articleId: string;
    sortBy?: CommentModelsSortType;
  } & ApiPagingReqProps,
  CommentModelsWithPaging | null | FirebaseError
>): Promise<CommentModelListPagedSorted | null> {
  try {
    const res = await repoRtCommentGet(data);
    callback?.(netSuccess("Success getting comments", res));
    return res;
  } catch (error) {
    callback?.(netError("Error when getting comments", error as FirebaseError));
    return null;
  }
}

export async function fbCommentUpdate({
  data,
  callback,
}: MainApiResponse<
  { comment: CommentModel },
  CommentModel | null | FirebaseError
>) {
  const { comment } = data;
  try {
    await repoRtCommentUpdate({
      comment: comment,
    });
    callback?.(netSuccess("Success updating comment", comment));
    return;
  } catch (error) {
    callback?.(netError("Error when updating comment", error as FirebaseError));
    return;
  }
}

export interface FbCommentReactProps {
  react: "up" | "down" | "upCancel" | "downCancel";
  commentId: string;
  articleId: string;
  userId: string;
}

export async function fbCommentReact({
  data,
  callback,
}: MainApiResponse<
  FbCommentReactProps,
  CommentModel | null | FirebaseError
>): Promise<CommentModel | null> {
  try {
    const res = await repoRtCommentReact(data);
    callback?.(netSuccess("Success updating comment", res));
    console.log(res);
    return res;
  } catch (error) {
    callback?.(netError("Error when updating comment", error as FirebaseError));
    return null;
  }
}

export async function fbCommentDelete({
  data,
  callback,
}: MainApiResponse<
  { articleId: string; commentId: string },
  CommentModel | null | FirebaseError
>) {
  try {
    await repoRtCommentDelete(data);
    callback?.(netSuccess("Success deleting comment", null));
    return;
  } catch (error) {
    callback?.(netError("Error when deleting comment", error as FirebaseError));
    return;
  }
}
