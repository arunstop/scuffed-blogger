import { FirebaseError } from "firebase/app";
import { CommentModel } from "../../../data/models/CommentModel";
import {
  rtCommentAdd,
  rtCommentDelete,
  rtCommentGet,
  rtCommentReact,
  rtCommentUpdate,
} from "../RealtimeDatabase/RealtimeCommentModules";
import {
  ApiPagingReqProps,
  MainNetworkResponse,
  netError,
  netSuccess,
} from "./../../../data/Main";
import { CommentModelsWithPaging } from "./../../../data/models/CommentModel";

type ApiResponse<DATA, RESP> = {
  data: DATA;
  callback?: (resp: MainNetworkResponse<RESP>) => void;
};

export async function fbCommentAdd({
  data,
  callback,
}: ApiResponse<
  { comment: CommentModel },
  CommentModel | null | FirebaseError
>): Promise<boolean> {
  const { comment } = data;
  try {
    await rtCommentAdd({
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
}: ApiResponse<
  {
    articleId: string;
  } & ApiPagingReqProps,
  CommentModelsWithPaging | null | FirebaseError
>) {
  try {
    const res = await rtCommentGet(data);
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
}: ApiResponse<
  { comment: CommentModel },
  CommentModel | null | FirebaseError
>) {
  const { comment } = data;
  try {
    await rtCommentUpdate({
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
}: ApiResponse<
  FbCommentReactProps,
  CommentModel | null | FirebaseError
>): Promise<CommentModel | null> {
  try {
    const res = await rtCommentReact(data);
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
}: ApiResponse<
  { articleId: string; commentId: string },
  CommentModel | null | FirebaseError
>) {
  try {
    await rtCommentDelete(data);
    callback?.(netSuccess("Success deleting comment", null));
    return;
  } catch (error) {
    callback?.(netError("Error when deleting comment", error as FirebaseError));
    return;
  }
}
