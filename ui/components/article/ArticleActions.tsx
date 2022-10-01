import { Transition } from "@headlessui/react";
import { useState } from "react";
import {
  MdBookmarkAdd,
  MdOutlinePlaylistAdd,
  MdShare,
  MdThumbDown,
  MdThumbUp,
} from "react-icons/md";
import { useAuthCtx } from "../../../app/contexts/auth/AuthHook";
import {
  ArticleModel,
  factoryArticleRemoveContent as factoryArticleContentRemove,
} from "../../../base/data/models/ArticleModel";
import { serviceArticleReact } from "../../../app/services/ArticleService";
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
      ? list
      : !list
      ? []
      : filterReacts(list, userId);
  };

  const newArticleEntry: ArticleModel = {
    ...article,
    likes: type === "like" ? reactions(likes) : antiReactions(likes),
    dislikes:
      type === "dislike" ? reactions(dislikes) : antiReactions(dislikes),
  };
  return newArticleEntry;
}

function ArticleSectionAction({ article }: { article: ArticleModel }) {
  const {
    authStt: { user },
  } = useAuthCtx();
  const [articleContentless, setArticleContentless] = useState(
    factoryArticleContentRemove(article),
  );

  const liked = user ? !!articleContentless.likes.includes(user.id) : false;
  const disliked = user
    ? !!articleContentless.dislikes.includes(user.id)
    : false;
  const like = async () => {
    if (!user) return;
    await serviceArticleReact({
      data: {
        article: getArticleAfterReaction({
          type: "like",
          article: articleContentless,
          reacted: liked,
          userId: user.id,
        }),
      },
    }).then((e) => {
      if (e) return setArticleContentless(e);
    });
  };

  const dislike = async () => {
    if (!user) return;
    await serviceArticleReact({
      data: {
        article: getArticleAfterReaction({
          type: "dislike",
          article: articleContentless,
          reacted: disliked,
          userId: user.id,
        }),
      },
    }).then((e) => {
      if (e) return setArticleContentless(e);
    });
  };

  return (
    <div className="flex flex-wrap gap-4 sm:justify-end">
      <div className="inline-flex w-full gap-4 sm:w-auto">
        <button
          className={`btn flex-1 gap-2 sm:gap-4 !border-[2px] sm:min-w-32 sm:flex-none sm:border-2 --btn-resp 
          btn-success ${!liked ? "btn-outline" : ""} `}
          title="Like"
          onClick={() => like()}
        >
          <Transition
            key={`liked-${liked}`}
            appear
            enter="transition-transform duration-[600ms]"
            enterFrom="rotate-[0deg]"
            enterTo="rotate-[360deg]"
          >
            <MdThumbUp className="text-xl sm:text-2xl" />
          </Transition>
          {articleContentless.likes.length || ""}
        </button>

        <button
          className={`btn flex-1 gap-2 sm:gap-4 !border-[2px] sm:min-w-32 sm:flex-none sm:border-2 --btn-resp 
          btn-error ${!disliked ? "btn-outline" : ""} `}
          title="Dislike"
          onClick={() => dislike()}
        >
          <Transition
            key={`disliked-${disliked}`}
            appear
            enter="transition-transform duration-[600ms]"
            enterFrom="rotate-[0deg]"
            enterTo="rotate-[360deg]"
          >
            <MdThumbDown className="text-xl sm:text-2xl" />
          </Transition>
          {articleContentless.dislikes.length || ""}
        </button>
      </div>
      {/* <button
        className="btn border-yellow-500 hover:border-yellow-600 w-full gap-2 text-xl 
        font-bold normal-case sm:w-48 bg-yellow-500 hover:bg-yellow-600 text-white"
      > */}
      <button
        className="--btn-resp btn btn-primary w-full 
        gap-2 font-bold normal-case sm:w-48"
      >
        <MdBookmarkAdd className="text-2xl" />
        Bookmark
      </button>
      <button
        className="--btn-resp btn btn-primary w-full 
        gap-2 font-bold normal-case sm:w-48"
      >
        <MdOutlinePlaylistAdd className="text-2xl" />
        Read Later
      </button>
      <button
        className="--btn-resp btn btn-primary w-full 
        gap-2 font-bold normal-case sm:w-48"
      >
        <MdShare className="text-2xl" />
        Share
      </button>
    </div>
  );
}

export default ArticleSectionAction;
