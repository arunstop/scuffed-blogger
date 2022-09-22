import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { MdBookmarkAdd, MdMoreHoriz } from "react-icons/md";
import { ArticleModel } from "../../utils/data/models/ArticleModel";
import { getElById } from "../../utils/helpers/UiHelpers";
import MainIntersectionObserverTrigger from "../main/MainIntersectionObserverTrigger";
import MainUserPopup from "../main/MainPostUserPopup";
import MainUserLabel from "../main/MainUserLabel";
import PostLinker from "./PostLinker";

interface PostItemProps {
  article: ArticleModel;
  observe?: boolean;
}
function PostItem({ article, observe }: PostItemProps) {
  const [visible, setVisible] = useState(true);
  const elementId = `article-${article.id}`;
  const element = getElById(elementId);
  return observe ? (
    <MainIntersectionObserverTrigger
      id={elementId}
      callback={(intersecting) => setVisible(intersecting)}
      className=""
      style={
        visible
          ? undefined
          : {
              height: `${element?.clientHeight}px`,
              width: `1px`,
            }
      }
    >
      {visible && <PostItemContent article={article} />}
    </MainIntersectionObserverTrigger>
  ) : (
    <PostItemContent article={article} />
  );
}

//new
// const PostItemContent = React.forwardRef<
//   HTMLDivElement,
//   React.PropsWithChildren<
//     { article: ArticleModel } & React.HTMLAttributes<HTMLDivElement>
//   >
// >((props, ref) => {
//   const router = useRouter();
//   const { article, style } = props;

// old
const PostItemContent = ({ article }: { article: ArticleModel }) => {
  const router = useRouter();

  return (
    <div
      className="group flex w-full flex-col rounded-xl bg-primary
      bg-opacity-10 shadow-lg ring-1 ring-base-content/20 transition-all
      hover:bg-opacity-40 sm:flex-row sm:min-h-[20rem] animate-fadeIn animate-duration-300
      relative overflow-hidden"
    >
      <PostLinker
        href={`/article/${article.slug}`}
        className=" aspect-square  w-full overflow-hidden rounded-t-xl 
        rounded-bl-none bg-base-300 sm:h-auto sm:w-72 sm:rounded-l-xl sm:rounded-tr-none
        absolute sm:relative inset-0 h-full
        "
      >
        <img
          className="h-full w-full max-w-none object-cover transition-transform 
          duration-1000 group-hover:scale-[1.2]"
          src={`${
            article.thumbnail ||
            `https://picsum.photos/id/${article.dateAdded
              .toString()
              .split("")
              .slice(-2)
              .join("")}/500/300`
          }`}
          alt="Image"
          width={240}
          height={240}
          loading="lazy"
        />
        {/* <div className=" absolute left-0 bottom-0 flex flex-wrap justify-start gap-2 overflow-hidden p-2">
          <MainPostStatusChip
            icon={<MdStar className="text-xl sm:text-2xl" />}
            title="Favorited"
            color="bg-yellow-500"
          />
          <MainPostStatusChip
            icon={<MdTrendingUp className="text-xl sm:text-2xl" />}
            title="Trending"
            color="bg-red-500"
          />
          <MainPostStatusChip
            icon={<MdForum className="text-xl sm:text-2xl" />}
            title="Active"
            color="bg-blue-500"
          />
        </div> */}
      </PostLinker>
      {/* shading layer for small viewport */}
      <div className="inset-0 absolute   bg-gradient-to-b from-base-300/50 to-primary/70 sm:hidden" />
      {/* the actual content */}
      <div className="flex flex-1 flex-col gap-2 sm:gap-4 p-4 z-[1]">
        <div className="inline-flex items-center gap-2 sm:gap-4">
          <div className="dropdown-hover dropdown self-start sm:dropdown-end z-[2]">
            <MainUserLabel
              id={article.dateUpdated.toString().substring(0, -2)}
            />

            <div tabIndex={0} className="dropdown-content pt-2 hidden sm:block">
              <MainUserPopup id={article.slug} />
            </div>
          </div>

          <Link
            href={{
              pathname: router.asPath,

              query: {
                postoption: article.slug,
              },
            }}
            shallow
          >
            <a
              className="btn btn-ghost ml-auto aspect-square rounded-xl p-0 
              opacity-80 hover:opacity-100"
              title="Options"
            >
              <MdMoreHoriz className="text-2xl sm:text-3xl" />
            </a>
          </Link>
        </div>

        <PostLinker href={`/article/${article.slug}`}>
          <h1 className="text-2xl font-black group-hover:underline sm:text-3xl line-clamp-2">
            {`${article.title}`}
          </h1>
        </PostLinker>
        <span className="text-base sm:text-lg line-clamp-3">
          {`${article.desc}`}
        </span>
        <div className="flex flex-wrap gap-2 text-sm font-light sm:text-base">
          <span className="">2d ago</span>
          <span className="font-black">&middot;</span>
          <span className="">2mins read</span>
          <span className="font-black">&middot;</span>
          <span className="">Technology</span>
        </div>
        {/* Action */}
        <div className="flex flex-row items-center mt-auto justify-end gap-2 sm:gap-4">
          <button
            className="btn-neutral btn-outline btn btn-sm btn-circle
            font-bold normal-case opacity-80
            group-hover:opacity-100 sm:btn-md"
            title="Add to bookmark"
          >
            <span className="text-2xl">
              <MdBookmarkAdd />
            </span>
          </button>
          <PostLinker href={`/article/${article.slug}`}>
            <button
              className="btn-neutral btn-outline btn btn-sm w-32
              text-lg font-bold normal-case opacity-80
              group-hover:opacity-100 sm:btn-md sm:!text-xl"
            >
              Read
            </button>
          </PostLinker>
        </div>
      </div>
    </div>
  );
};
export default React.memo(PostItem);
