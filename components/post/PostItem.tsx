import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { MdBookmarkAdd, MdMoreHoriz } from "react-icons/md";
import { ArticleModel } from "../../utils/data/models/ArticleModel";
import { dateDistanceGet } from "../../utils/helpers/MainHelpers";
import { getElById } from "../../utils/helpers/UiHelpers";
import MainIntersectionObserverTrigger from "../main/MainIntersectionObserverTrigger";
import MainUserPopup from "../main/MainPostUserPopup";
import MainUserLabel from "../main/MainUserLabel";

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
              width: `100%`,
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
  const duration = Math.ceil(article.duration);
  return (
    <div
      className="group relative flex w-full animate-fadeIn flex-col
      overflow-hidden rounded-xl bg-primary bg-opacity-10 shadow-lg
      ring-1 ring-base-content/20 transition-all animate-duration-300 hover:bg-opacity-40
      sm:min-h-[10rem] sm:flex-row"
    >
      <Link href={`/article/${article.slug}`} passHref>
        <a
          className=" absolute  inset-0 aspect-square h-full 
        w-full overflow-hidden rounded-t-xl rounded-bl-none bg-base-content/30 sm:relative
        sm:h-auto sm:w-72 sm:rounded-l-xl sm:rounded-tr-none
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
        </a>
      </Link>

      {/* shading layer for small viewport */}
      <div className="absolute inset-0   bg-gradient-to-b from-base-300/50 to-primary/70 sm:hidden" />
      {/* the actual content */}
      <div className="z-[1] flex flex-1 flex-col gap-2 p-4 sm:gap-4">
        <div className="inline-flex items-center gap-2 sm:gap-4">
          <div className="dropdown-hover dropdown z-[2] self-start sm:dropdown-end">
            <MainUserLabel
              id={article.dateUpdated.toString().substring(0, -2)}
            />

            <div tabIndex={0} className="dropdown-content hidden pt-2 sm:block">
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
            passHref
          >
            <a
              className="btn-ghost btn ml-auto aspect-square rounded-xl p-0 
              opacity-80 hover:opacity-100"
              title="Options"
            >
              <MdMoreHoriz className="text-xl sm:text-2xl" />
            </a>
          </Link>
        </div>

        <Link href={`/article/${article.slug}`} passHref>
          <a className="text-lg font-black line-clamp-2 group-hover:underline sm:text-xl">
            {`${article.title}`}
          </a>
        </Link>
        <span className="text-sm font-semibold line-clamp-2 sm:line-clamp-3 sm:text-base">
          {`${article.desc}`}
        </span>
        <div className="block text-xs sm:text-sm [&>b]:mx-[0.5rem] line-clamp-1 font-medium">
        <span className="">323 views</span>
        <b className="font-black">&middot;</b>
          
          <span className="">
            {`${dateDistanceGet(article.dateAdded, Date.now())} ago`}
          </span>
          <b className="font-black">&middot;</b>
          <span className="">{`${duration} min${
            duration > 1 ? "s" : ""
          }`}</span>
          <b className="font-black">&middot;</b>
          <span className="">{article.topics.join(", ")}</span>
        </div>
        {/* Action */}
        <div className="mt-auto flex flex-row items-center justify-end gap-2 sm:gap-4">
          <button
            className="btn-neutral btn-outline btn-sm btn-circle btn
            font-bold normal-case opacity-80
            group-hover:opacity-100 sm:btn-md"
            title="Add to bookmark"
          >
            <span className="text-2xl">
              <MdBookmarkAdd />
            </span>
          </button>
          <Link href={`/article/${article.slug}`} passHref>
            <a
              className="btn-neutral btn-outline btn-sm btn w-32
              text-lg font-bold normal-case opacity-80
              group-hover:opacity-100 sm:btn-md sm:!text-xl"
            >
              Read
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default React.memo(PostItem);
