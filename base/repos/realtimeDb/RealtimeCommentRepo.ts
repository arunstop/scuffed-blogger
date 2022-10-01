import { get, ref, remove, set } from "firebase/database";
import _ from "lodash";
import { FbCommentReactProps } from "../../../app/services/CommentService";
import { firebaseClient } from "../../clients/FirebaseClient";
import { ApiPagingReqProps } from "../../data/Main";
import { CommentModel, CommentModelListPagedSorted, CommentModelsSortType } from "../../data/models/CommentModel";

const db = firebaseClient.rtdb;

export async function rtCommentGet({
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

export async function rtCommentAdd({ comment }: { comment: CommentModel }) {
  const path = `commentList/${comment.articleId}/${comment.id}`;
  const rr = ref(db, path);
  await set(rr, comment);
  return comment;
}

export async function rtCommentUpdate({ comment }: { comment: CommentModel }) {
  await rtCommentDelete({
    articleId: comment.articleId,
    commentId: comment.id,
  });
  await rtCommentAdd({ comment });
  return comment;
}

export async function rtCommentReact({
  react,
  commentId,
  articleId,
  userId,
}: FbCommentReactProps) {
  const path = `commentList/${articleId}/${commentId}`;
  const rr = ref(db, path);
  const res = await get(rr);
  if (res.exists()) {
    // data raw is a CommentModel from rtdb
    // but probably without upvote/downvote props
    const dataRaw = res.val() as CommentModel;
    let updatedData = dataRaw;
    const cancelledUpvote = (updatedData.upvote || []).filter(
      (e) => e !== userId,
    );
    const cancelledDownvote = (updatedData.downvote || []).filter(
      (e) => e !== userId,
    );
    try {
      switch (react) {
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
    await rtCommentUpdate({ comment: updatedData });
    return updatedData;
  }
  return null;
}

export async function rtCommentDelete({
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
