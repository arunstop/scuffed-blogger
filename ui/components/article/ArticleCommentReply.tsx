import {
  CommentModel,
  CommentModelsWithPaging
} from "../../../base/data/models/CommentModel";
import ArticleComments from "./ArticleComments";

function ArticleCommentReply({
  comment,
  replies,
  toggleShowReplies,
  showReplies,
}: {
  comment: CommentModel;
  replies?: CommentModelsWithPaging;
  showReplies:boolean;
  toggleShowReplies: () => void;
}) {
  console.log(replies);
  const count = comment.replies?.length || 0;
  const isAllShown = replies?.total || 0 <= (replies?.comments.length || 0);

  return (
    <>
      <button
        className="btn btn-outline rounded-xl btn-xs sm:btn-sm mr-auto"
        onClick={toggleShowReplies}
      >
        {showReplies
          ? `${count == 1 ? "Hide reply" : `Hide replies`}`
          : `${count == 1 ? "Show reply" : `Show ${count} replies`}`}
      </button>
      {showReplies && !!replies && (
        <div
          className={`flex flex-col ${
            !isAllShown ? "mb-4 sm:mb-8" : ""
          } mt-1 sm:mt-2 rounded-xl`}
        >
          <ArticleComments commentList={replies} lined />
        </div>
      )}
    </>
  );
}

export default ArticleCommentReply;
