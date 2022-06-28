import React, { useCallback, useState } from "react";
import {
  MdBookmarkAdd,
  MdOutlinePlaylistAdd,
  MdShare,
  MdThumbDown,
  MdThumbUp,
} from "react-icons/md";
import { ArticleModel } from "../../utils/data/models/ArticleModel";
import ArticleReactionButton from "./ArticleReactionButton";

const LikeButton = React.memo(function LikeButton() {
  const [like, setLike] = useState(false);

  const toggleLike = useCallback((value: boolean) => setLike(value), []);

  return (
    <ArticleReactionButton
      value={like}
      icon={<MdThumbUp />}
      color="success"
      outlined
      title="Like"
      onChange={toggleLike}
      className="hover:bg-opacity-20 hover:text-success"
    />
  );
});

const DislikeButton = React.memo(function DislikeButton() {
  const [dislike, setDislike] = useState(false);

  const toggleDislike = useCallback((value: boolean) => setDislike(value), []);

  return (
    <ArticleReactionButton
      value={dislike}
      icon={<MdThumbDown />}
      color="error"
      outlined
      title="Disike"
      onChange={toggleDislike}
      className="hover:bg-opacity-20 hover:text-error"
    />
  );
});

function ArticleSectionAction({ article }: { article: ArticleModel }) {
  return (
    <div className="flex flex-wrap gap-4 sm:justify-end">
      <div className="inline-flex w-full gap-4 sm:w-auto">
        {<LikeButton/>}
        {<DislikeButton/>}
      </div>
      {/* <button
        className="btn border-yellow-500 hover:border-yellow-600 w-full gap-2 text-xl 
        font-bold normal-case sm:w-48 bg-yellow-500 hover:bg-yellow-600 text-white"
      > */}
      <button
        className="btn --btn-resp btn-primary w-full 
        gap-2 font-bold normal-case sm:w-48"
      >
        <MdBookmarkAdd className="text-2xl" />
        Bookmark
      </button>
      <button
        className="btn --btn-resp btn-primary w-full 
        gap-2 font-bold normal-case sm:w-48"
      >
        <MdOutlinePlaylistAdd className="text-2xl" />
        Read Later
      </button>
      <button
        className="btn --btn-resp btn-primary w-full 
        gap-2 font-bold normal-case sm:w-48"
      >
        <MdShare className="text-2xl" />
        Share
      </button>
    </div>
  );
}

export default ArticleSectionAction;
