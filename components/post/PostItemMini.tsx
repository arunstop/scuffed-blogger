import { formatDistance } from "date-fns";
import Link from "next/link";
import React from "react";
import { MdDelete, MdEdit, MdVisibility } from "react-icons/md";
import { ArticleModel } from "../../utils/data/models/ArticleModel";

function PostItemMini({ article }: { article: ArticleModel }) {
  const postedAt = formatDistance(article.dateAdded, Date.now());
  return (
    <div
      className="group flex w-full overflow-hidden rounded-xl bg-primary
        bg-opacity-10 shadow-lg transition-all hover:bg-opacity-40 flex-row
        "
    >
      {/* <Link href={`/article/${post.id}`} passHref> */}
      <a className="relative aspect-video w-24 sm:w-48 overflow-hidden">
        <img
          className="h-full w-full max-w-none object-cover transition-transform group-hover:scale-[1.2]"
          src={
            article.thumbnail ||
            `https://picsum.photos/id/${article.dateAdded.toString().split("").slice(-2).join("")}/500/300`
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
          <span className="capitalize">{`${postedAt} ago`}</span>
          <span className="font-black">&middot;</span>
        </div>
        {/* options for desktop */}
        <div className="hidden flex-row items-center mt-auto justify-end gap-2 sm:flex">
          <button className="btn btn-circle btn-sm btn-outline">
            <MdVisibility className="text-xl" />
          </button>
          <button className="btn btn-circle btn-sm btn-outline btn-primary">
            <MdEdit className="text-xl" />
          </button>
          <Link
            href={{
              query: {
                articleId: article.id,
              },
            }}
            shallow
          >
            <a className="btn btn-circle btn-sm btn-outline btn-error">
              <MdDelete className="text-xl" />
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default React.memo(PostItemMini);
