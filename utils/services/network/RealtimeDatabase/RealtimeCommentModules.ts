import { ApiPagingReqProps } from "./../../../data/Main";
import { get, ref, remove, set } from "firebase/database";
import {
  CommentModel,
  CommentModelsWithPaging,
} from "../../../data/models/CommentModel";
import { firebaseClient } from "./../FirebaseClient";
import _ from "lodash";
import { FbCommentReactProps } from "../FirebaseApi/FirebaseCommentModules";
const db = firebaseClient.rtdb;

export async function rtCommentGet({
  articleId,
  start,
  count,
}: //   keyword,
{
  articleId: string;
} & ApiPagingReqProps): Promise<CommentModelsWithPaging | null> {
  const path = `commentList/${articleId}`;
  const rr = ref(db, path);
  const res = await get(rr);
  if (res.exists()) {
    const dataRaw = res.val();
    const data = _.values(dataRaw) as CommentModel[];
    // console.log(data);
    // apply filter based of keyword before slicing/paging
    // if(keyword) {
    //     const res = data.filter((e,idx)=>{

    //     });
    //     return res;
    // }
    return {
      comments: data.slice(start, start + count),
      total: data.length,
      offset: start + count,
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
    try {
      switch (react) {
        case "up": {
          updatedData = {
            ...updatedData,
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
          updatedData = {
            ...updatedData,
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
