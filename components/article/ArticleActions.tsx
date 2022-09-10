import { useState } from "react";
import {
  MdBookmarkAdd,
  MdOutlinePlaylistAdd,
  MdShare,
  MdThumbDown,
  MdThumbUp,
} from "react-icons/md";
import { useAuthCtx } from "../../utils/contexts/auth/AuthHook";
import {
  ArticleModel,
  toArticleContentless,
} from "../../utils/data/models/ArticleModel";
import { fbArticleReact } from "../../utils/services/network/FirebaseApi/ArticleModules";
import ArticleReactionButton from "./ArticleReactionButton";
interface ArticleReactProps {
  value: boolean;
  action: () => void;
}

function filterReacts(reacts: string[], valToRemove: string) {
  return reacts.filter((e) => e !== valToRemove);
}
function getArticleAfterReaction({
  type,
  article,
  reacted,
  userId,
}: {
  type: "like" | "dislike";
  article: ArticleModel;
  reacted: boolean;
  userId: string;
}): ArticleModel {
  const { likes, dislikes } = article;
  const reactions = (list: string[] = []): string[] => {
    return reacted
      ? list
        ? filterReacts(list, userId)
        : []
      : [...(list || []), userId];
  };

  const antiReactions = (list: string[] = []): string[] => {
    return reacted //
      ? list || []
      : !list
      ? []
      : filterReacts(list, userId);
  };

  const newArticleEntry: ArticleModel = {
    ...article,
    likes: type === "like" ? reactions(likes) : antiReactions(dislikes),
    dislikes: type === "like" ? antiReactions(dislikes) : antiReactions(likes),
  };
  return newArticleEntry;
}

function ArticleSectionAction({ article }: { article: ArticleModel }) {
  const {
    authStt: { user },
  } = useAuthCtx();
  const articleContentless = toArticleContentless(article);

  const [liked, setLiked] = useState(
    user ? !!article.likes?.includes(user.id) : false,
  );
  const like = async () => {
    if (!user) return;
    await fbArticleReact({
      data: {
        oldArticle: articleContentless,
        newArticle: getArticleAfterReaction({
          type: "like",
          article: articleContentless,
          reacted: liked,
          userId: user.id,
        }),
        type: "like",
      },
    }).then((e) => {
      if (e) {
        setLiked((prev) => !prev);
        if (disliked) setDisliked((prev) => !prev);
      }
    });
  };

  const [disliked, setDisliked] = useState(
    user ? !!article.dislikes?.includes(user.id) : false,
  );
  const dislike = async () => {
    if (!user) return;
    await fbArticleReact({
      data: {
        oldArticle: articleContentless,
        newArticle: getArticleAfterReaction({
          type: "dislike",
          article: articleContentless,
          reacted: disliked,
          userId: user.id,
        }),
        type: "dislike",
      },
    }).then((e) => {
      if (e) {
        setDisliked((prev) => !prev);
        if (liked) setLiked((prev) => !prev);
      }
    });
  };

  return (
    <div className="flex flex-wrap gap-4 sm:justify-end">
      <div className="inline-flex w-full gap-4 sm:w-auto">
        <ArticleReactionButton
          value={liked}
          icon={<MdThumbUp />}
          color="success"
          outlined
          title="Like"
          onChange={like}
          className={`hover:bg-opacity-20 hover:text-success`}
          disabled={!user}
        />
        <ArticleReactionButton
          value={disliked}
          icon={<MdThumbDown />}
          color="error"
          outlined
          title="Disike"
          onChange={dislike}
          className={`hover:bg-opacity-20 hover:text-error`}
          disabled={!user}
        />
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
