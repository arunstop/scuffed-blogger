import { ApiPagingReqProps } from "./../../../data/Main";
import { get, ref, remove, set } from "firebase/database";
import {
  CommentModel,
  CommentModelWithPaging,
} from "../../../data/models/CommentModel";
import { firebaseClient } from "./../FirebaseClient";
const db = firebaseClient.rtdb;

export async function rtCommentGet({
  articleId,
  start,
  count,
}: //   keyword,
{
  articleId: string;
} & ApiPagingReqProps): Promise<CommentModelWithPaging | null> {
  const path = `commentList/${articleId}`;
  const rr = ref(db, path);
  const res = await get(rr);
  if (res.exists()) {
    const data = res.val() as CommentModel[];
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
  const path = `commentlist/${comment.articleId}/${comment.id}`;
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
