import { get, ref, remove, set } from "firebase/database";
import _ from "lodash";
import { toJsonFriendly } from "../../../app/helpers/MainHelpers";
import { firebaseClient } from "../../clients/FirebaseClient";
import { ApiPagingReqProps } from "../../data/Main";
import {
  CommentModel,
  CommentModelListPagedSorted,
  CommentModelsSortType,
  CommentModelsWithPaging,
  factoryCommentComplete,
} from "../../data/models/CommentModel";
import { ServiceCommentReactProps } from "./../../../app/services/CommentService";

const db = firebaseClient.rtdb;

export async function repoRtCommentGet({
  articleId,
  start,
  count,
  sortBy = "new",
}: //   keyword,
{
  articleId: string;
  sortBy?: CommentModelsSortType;
} & ApiPagingReqProps): Promise<CommentModelListPagedSorted | null> {
  const path = `commentList/${articleId}`;
  const rr = ref(db, path);
  const res = await get(rr);
  if (res.exists()) {
    const dataRaw = res.val();
    const data = _.values(dataRaw) as CommentModel[];
    const sort = (comments: CommentModel[]) => {
      return comments.sort((a, b) => {
        if (sortBy === "new") return b.dateAdded - a.dateAdded;
        if (sortBy === "top")
          return (b.upvote?.length || 0) - (a.upvote?.length || 0);
        return 0;
      });
    };
    // console.log(data);
    // apply filter based of keyword before slicing/paging
    // if(keyword) {
    //     const res = data.filter((e,idx)=>{

    //     });
    //     return res;
    // }
    return {
      comments: sort(data).slice(start, start + count),
      total: data.length,
      offset: start + count,
      sortBy: sortBy,
    };
  }
  return null;
}

export async function repoRtCommentAdd({ comment }: { comment: CommentModel }) {
  const path = `commentList/${comment.articleId}/${comment.id}`;
  const rr = ref(db, path);
  await set(rr, toJsonFriendly(comment));
  return comment;
}

export async function repoRtCommentUpdate({
  comment,
}: {
  comment: CommentModel;
}) {
  await repoRtCommentDelete({
    articleId: comment.articleId,
    commentId: comment.id,
  });
  await repoRtCommentAdd({ comment });
  return comment;
}

export async function repoRtCommentReact(props: ServiceCommentReactProps) {
  const {
    type,
    comment: { articleId, id, parentCommentId },
    userId,
  } = props;
  let path = ``;
  // check if the comment is a reply
  if (parentCommentId) path = `replyList/${articleId}/${parentCommentId}/${id}`;
  else path = `commentList/${articleId}/${id}`;

  const rr = ref(db, path);
  const res = await get(rr);
  // do nothing if comment/reply is not found
  if (!res.exists()) return null;

  // data raw is a CommentModel from rtdb
  // but probably without upvote/downvote props
  const dataRaw = res.val() as CommentModel;
  // that's why we need complete it
  let updatedData = factoryCommentComplete(dataRaw);
  const cancelledUpvote = (updatedData.upvote || []).filter(
    (e) => e !== userId,
  );
  const cancelledDownvote = (updatedData.downvote || []).filter(
    (e) => e !== userId,
  );
  try {
    switch (type) {
      case "up": {
        // when upvoting, cancel downvote first
        updatedData = {
          ...updatedData,
          downvote: cancelledDownvote,
          upvote: [...(updatedData.upvote || []), userId],
        };
        break;
      }
      case "upCancel": {
        updatedData = {
          ...updatedData,
          upvote: (updatedData.upvote || []).filter((e) => e !== userId),
        };
        break;
      }
      case "down": {
        // when downvoting, cancel upvote first
        updatedData = {
          ...updatedData,
          upvote: cancelledUpvote,
          downvote: [...(updatedData.downvote || []), userId],
        };
        break;
      }
      case "downCancel": {
        updatedData = {
          ...updatedData,
          downvote: (updatedData.downvote || []).filter((e) => e !== userId),
        };
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
  // once again check if the comment is indeed a reply or not
  if (parentCommentId) await repoRtCommentReplyUpdate({ reply: updatedData });
  else await repoRtCommentUpdate({ comment: updatedData });

  return updatedData;
}

export async function repoRtCommentDelete({
  articleId,
  commentId,
}: {
  articleId: string;
  commentId: string;
}) {
  const path = `commentList/${articleId}/${commentId}`;
  const rr = ref(db, path);
  await remove(rr);
}

export async function repoRtCommentGetById({
  commentId,
  articleId,
}: {
  commentId: string;
  articleId: string;
}) {
  console.log(commentId.trim() + "/////" + articleId.trim());
  if (!commentId.trim() || !articleId.trim()) return;
  const path = `commentList/${articleId}/${commentId}`;
  console.log(path);
  const rr = ref(db, path);
  const res = await get(rr);
  if (!res.exists()) return null;
  return factoryCommentComplete(res.val() as CommentModel);
}

export async function repoRtCommentReplyAdd({
  reply,
  parentCommentId,
}: {
  reply: CommentModel;
  parentCommentId: string;
}): Promise<CommentModel | null> {
  const path = `replyList/${reply.articleId}/${parentCommentId}/${reply.id}`;
  const rr = ref(db, path);
  await set(rr, toJsonFriendly(reply));
  return reply;
}

export async function repoRtCommentReplyUpdate({
  reply,
}: {
  reply: CommentModel;
}) {
  if (!reply.parentCommentId) return null;
  await repoRtCommentReplyDelete({
    articleId: reply.articleId,
    id: reply.id,
    parentCommentId: reply.parentCommentId,
  });
  await repoRtCommentReplyAdd({
    reply: reply,
    parentCommentId: reply.parentCommentId,
  });

  return reply;
}

export async function repoRtCommentReplyGet({
  articleId,
  parentCommentId,
  start,
  count,
}: //   keyword,
{
  articleId: string;
  parentCommentId: string;
} & ApiPagingReqProps): Promise<CommentModelsWithPaging | null> {
  const path = `replyList/${articleId}/${parentCommentId}`;
  const rr = ref(db, path);
  const res = await get(rr);
  if (res.exists()) {
    const dataRaw = res.val();
    const data = (_.values(dataRaw) as CommentModel[]).map((e) =>
      factoryCommentComplete(e),
    );
    return {
      comments: data.slice(start, start + count),
      total: data.length,
      offset: start + count,
    };
  }
  return null;
}

export async function repoRtCommentReplyDelete({
  articleId,
  parentCommentId,
  id,
}: {
  articleId: string;
  parentCommentId: string;
  id: string;
}) {
  const path = `replyList/${articleId}/${parentCommentId}/${id}`;
  const rr = ref(db, path);
  await remove(rr);
}

export async function repoRtCommentReplyDeleteByParent({
  articleId,
  parentCommentId,
}: {
  articleId: string;
  parentCommentId: string;
}) {
  const path = `replyList/${articleId}/${parentCommentId}`;
  const rr = ref(db, path);
  await remove(rr);
}
