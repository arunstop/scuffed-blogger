import { useEffect, useState } from "react";
import LayoutArticleCommentForm from "./LayoutArticleCommentForm";
import { CommentModelsWithPaging } from "../../../utils/data/models/CommentModel";
import { fbCommentGet } from "../../../utils/services/network/FirebaseApi/FirebaseCommentModules";
import ArticleComments from "../../../components/article/ArticleComments";

function LayoutArticleCommentSection({ articleId }: { articleId: string }) {
  const [commentList, setCommentList] = useState<CommentModelsWithPaging>();

  const loadComments = async () => {
    const commentsFromDb = await fbCommentGet({
      data: { articleId, start: 0, count: 5 },
    });
    console.log("commentsFromDb", commentsFromDb);
    if (commentsFromDb) setCommentList(commentsFromDb);
  };

  useEffect(() => {
    loadComments();
  }, []);

  console.log("commentList", commentList);

  // console.log("render ArticleCommentSection");
  return (
    <div className="flex flex-col gap-4 sm:gap-8">
      <LayoutArticleCommentForm
        articleId={articleId}
        loadComments={loadComments}
      />
      {commentList && (
        <div className="flex flex-col-reverse gap-4 sm:gap-8">
          <ArticleComments commentList={commentList} />
        </div>
      )}
    </div>
  );
}

export default LayoutArticleCommentSection;
