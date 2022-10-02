import React, { useCallback, useState } from "react";
import { serviceCommentReplyGetByParent } from "../../../app/services/CommentService";
import {
  CommentModel,
  CommentModelsWithPaging,
} from "../../../base/data/models/CommentModel";
import ArticleComments from "./ArticleComments";

function ArticleCommentReply({ comment }: { comment: CommentModel }) {
  const [replies, setReplies] = useState<CommentModelsWithPaging>();
  const [show, setShow] = useState(false);
  const count = comment.replies?.length || 0;

  const loadReplies = useCallback(async () => {
    // if this comment is somehow a reply, don't do anything
    if (comment.parentCommentId) return;
    const repliesFromDb = await serviceCommentReplyGetByParent({
      data: {
        articleId: comment.articleId,
        parentCommentId: comment.id,
        count: 5,
        start: replies?.offset || 0,
      },
    });
    if (!repliesFromDb) return console.log("no replies for some reason");
    setReplies(repliesFromDb);
    setShow(true);
    console.log(repliesFromDb);
  }, [replies]);
  const isAllShown = replies?.total || 0 <= (replies?.comments.length || 0);
  return (
    <>
      {show && !!replies && (
        <div className={`flex flex-col ${!isAllShown ? "mb-4 sm:mb-8" : ""} border-2 border-base-content/10 rounded-xl`}>
          <ArticleComments commentList={replies} lined />
        </div>
      )}
      {!isAllShown ||
        (!replies && (
          <button
            className="btn btn-outline rounded-xl btn-xs sm:btn-sm mr-auto"
            onClick={() => loadReplies()}
          >
            {count == 1 ? "Show reply" : `Show ${count} replies`}
          </button>
        ))}
    </>
  );
}

export default ArticleCommentReply;
