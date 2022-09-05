import { formatDistance } from "date-fns";
import Link from "next/link";
import React, { useState } from "react";
import { MdDelete, MdEdit, MdList } from "react-icons/md";
import { ArticleModel } from "../../utils/data/models/ArticleModel";
import { getElById } from "../../utils/helpers/UiHelpers";
import MainIntersectionObserverTrigger from "../main/MainIntersectionObserverTrigger";
interface PostItemMiniProps {
  article: ArticleModel;
  observe?: boolean;
}
function PostItemMini({ article, observe }: PostItemMiniProps) {
  const [visible, setVisible] = useState(true);

  const elementId = `article-${article.id}`;

  return observe ? (
    <MainIntersectionObserverTrigger
      id={elementId}
      callback={(intersecting) => {
        setVisible(intersecting);
      }}
      style={
        visible
          ? undefined
          : {
              height: `${getElById(elementId)?.clientHeight}px`,
              width: `${getElById(elementId)?.clientWidth}px`,
            }
      }
    >
      {visible && <PostItemMiniContent article={article} />}
    </MainIntersectionObserverTrigger>
  ) : (
    <PostItemMiniContent article={article} />
  );
}

const PostItemMiniContent = ({ article }: { article: ArticleModel }) => {
  const postedAt = formatDistance(article.dateAdded, Date.now());
  return (
    // <Transition
    //   appear
    //   enter="transition-all duration-300"
    //   enterFrom="opacity-75 scale-90"
    //   enterTo="opacity-100 scale-100"
    //   className="group flex w-full overflow-hidden rounded-xl bg-primary
    // bg-opacity-10 shadow-lg transition-all hover:bg-opacity-40 flex-row"
    // >
    <div
      className="group flex w-full overflow-hidden rounded-xl bg-primary
      bg-opacity-10 shadow-lg transition-all hover:bg-opacity-40 flex-row"
    >
      {/* <Link href={`/article/${post.id}`} passHref> */}
      <a className="relative aspect-video w-24 sm:w-48 overflow-hidden">
        <img
          className="h-full w-full max-w-none object-cover transition-transform group-hover:scale-[1.2] animate"
          src={
            article.thumbnail ||
            `https://picsum.photos/id/${article.dateAdded
              .toString()
              .split("")
              .slice(-2)
              .join("")}/500/300`
          }
          alt="Image"
          width={100}
          height={100}
        />
        {/* <div className=" absolute left-0 bottom-0 flex flex-wrap justify-start gap-2 overflow-hidden p-2">
                  <PostStatusChipMini
                    icon={<MdStar className="text-xl sm:text-2xl" />}
                    title="Favorited"
                    color="bg-yellow-500"
                  />
                  <PostStatusChipMini
                    icon={<MdTrendingUp className="text-xl sm:text-2xl" />}
                    title="Trending"
                    color="bg-red-500"
                  />
                  <PostStatusChipMini
                    icon={<MdForum className="text-xl sm:text-2xl" />}
                    title="Active"
                    color="bg-blue-500"
                  />
                </div> */}
      </a>
      {/* </Link> */}

      <div className="flex flex-1 flex-col gap-4 p-4">
        <Link href={`/article/${article.slug}`} passHref>
          <a>
            <h1 className="font-black group-hover:underline sm:text-xl line-clamp-2">
              {article.title}
            </h1>
          </a>
        </Link>
        <div className="flex flex-row w-full items-center gap-2 text-sm font-light sm:text-base">
          <span className="">{`${postedAt} ago`}</span>
          <span className="font-black">&middot;</span>
          <span className="">{`${`17 likes`}`}</span>
          <span className="font-black">&middot;</span>
          <span className="">{`${`299 views`}`}</span>
        </div>
        {/* options for desktop */}
        <div className="hidden flex-row items-center mt-auto justify-end gap-2 sm:flex">
          <button
            className="btn btn-circle btn-sm btn-outline"
            title="View details"
          >
            <MdList className="text-xl" />
          </button>
          <Link href={`/article/edit/${article.id}`}>
            <a
              className="btn btn-circle btn-sm btn-outline btn-primary"
              title="Edit article"
            >
              <MdEdit className="text-xl" />
            </a>
          </Link>
          <Link
            href={{
              query: {
                articleId: article.id,
              },
            }}
            shallow
          >
            <a
              className="btn btn-circle btn-sm btn-outline btn-error"
              title="Delete article?"
            >
              <MdDelete className="text-xl" />
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PostItemMini);
