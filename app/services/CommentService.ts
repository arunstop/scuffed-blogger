import { FirebaseError } from "firebase/app";
import { ApiPagingReqProps, netError, netSuccess } from "../../base/data/Main";
import {
  CommentModel,
  CommentModelListPagedSorted,
  CommentModelsSortType,
  CommentModelsWithPaging,
} from "../../base/data/models/CommentModel";
import {
  repoRtCommentAdd,
  repoRtCommentDelete,
  repoRtCommentGet,
  repoRtCommentGetById,
  repoRtCommentReact,
  repoRtCommentReplyAdd,
  repoRtCommentReplyGet,
  repoRtCommentUpdate,
} from "../../base/repos/realtimeDb/RealtimeCommentRepo";
import { MainApiResponse } from "./../../base/data/Main";

export async function serviceCommentAdd({
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

export async function serviceCommentGet({
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

export async function serviceCommentUpdate({
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

export type CommentReactionTypes = "up" | "down" | "upCancel" | "downCancel";

export interface ServiceCommentReactProps {
  type: CommentReactionTypes;
  comment: CommentModel;
  userId:string;
}

export async function serviceCommentReact({
  data,
  callback,
}: MainApiResponse<
  ServiceCommentReactProps,
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

export async function serviceCommentDelete({
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

export async function serviceCommentReplyAdd({
  data,
  callback,
}: MainApiResponse<
  {
    comment: CommentModel;
    parentCommentId: string;
  },
  CommentModel | null | FirebaseError
>): Promise<CommentModel | null> {
  const { comment, parentCommentId } = data;
  try {
    // get parent comment
    const parentComment = await repoRtCommentGetById({
      commentId: parentCommentId,
      articleId: comment.articleId,
    });
    if (!parentComment) throw new Error("Error getting parent comment");
    callback?.(netSuccess("Success creating reply", parentComment));

    // update parent comment first
    // aka adding the replies
    const newParentComment = {
      ...parentComment,
      dateUpdated: Date.now(),
      replies: [...(parentComment.replies || []), comment.id],
    } as CommentModel;
    const updatedParentComment = await repoRtCommentUpdate({
      comment: newParentComment,
    });
    if (!updatedParentComment) throw new Error("Error updating parent comment");
    callback?.(netSuccess("Success creating reply", updatedParentComment));

    // then add the reply entry
    const addedReply = await repoRtCommentReplyAdd({
      reply: comment,
      parentCommentId: updatedParentComment.id,
    });
    if (!addedReply) throw new Error("Error adding reply");
    callback?.(netSuccess("Success adding reply", addedReply));

    return addedReply;
  } catch (error) {
    const message = typeof error === "string" ? error : "Error adding reply";
    console.error(error);
    callback?.(
      netError(
        message,
        typeof error === "string" ? null : (error as FirebaseError),
      ),
    );
    return null;
  }
}

export async function serviceCommentReplyGetByParent({
  data,
  callback,
}: MainApiResponse<
  { articleId: string; parentCommentId: string } & ApiPagingReqProps,
  CommentModelsWithPaging | null | FirebaseError
>): Promise<CommentModelsWithPaging | null> {
  try {
    const res = await repoRtCommentReplyGet(data);
    if (!res) throw new Error("Error getting replies");
    callback?.(netSuccess("Success getting replies", res));
    return res;
  } catch (error) {
    const message = typeof error === "string" ? error : "Error adding reply";
    console.error(error);
    callback?.(
      netError(
        message,
        typeof error === "string" ? null : (error as FirebaseError),
      ),
    );
    return null;
  }
}
