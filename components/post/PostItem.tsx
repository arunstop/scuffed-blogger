import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import {
  MdBookmarkAdd,
  MdForum,
  MdMoreHoriz,
  MdStar,
  MdTrendingUp,
} from "react-icons/md";
import { ArticleModel } from "../../utils/data/models/ArticleModel";
import MainPostStatusChip from "../main/MainPostFilterChip";
import MainUserPopup from "../main/MainPostUserPopup";
import MainUserLabel from "../main/MainUserLabel";
import PostLinker from "./PostLinker";

const randomId = () => Math.floor(Math.random() * 1000) + 1;

function PostItem({ article }: { article: ArticleModel }) {
  const router = useRouter();
  return (
    <div
      className="group flex w-full flex-col rounded-xl bg-primary
      bg-opacity-10 shadow-lg ring-1 ring-base-content/20 transition-all
      hover:bg-opacity-40 sm:flex-row sm:min-h-[20rem]
      "
    >
      <PostLinker
        href={`/article/${article.id}`}
        className="relative aspect-square h-60 w-full overflow-hidden rounded-t-xl 
        rounded-bl-none bg-base-content sm:h-auto sm:w-72 sm:rounded-l-xl sm:rounded-tr-none"
      >
        <img
          className="h-full w-full max-w-none object-cover transition-transform 
          duration-1000 group-hover:scale-[1.2]"
          src={`https://picsum.photos/id/${randomId()}/500/300`}
          alt="Image"
          width={240}
          height={240}
        />
        <div className=" absolute left-0 bottom-0 flex flex-wrap justify-start gap-2 overflow-hidden p-2">
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
        </div>
      </PostLinker>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="inline-flex items-center gap-4">
          <div className="dropdown-hover dropdown self-start sm:dropdown-end">
            <MainUserLabel id={article.id} />

            <div tabIndex={0} className="dropdown-content pt-2">
              <MainUserPopup id={article.id} />
            </div>
          </div>

          <Link
            href={{
              pathname: router.asPath,

              query: {
                postoption: article.id,
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

        <PostLinker href={`/article/${article.id}`}>
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
          <PostLinker href={`/article/${article.id}`}>
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
}

export default React.memo(PostItem);
