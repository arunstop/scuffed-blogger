import Link from "next/link";
import React from "react";

interface Post {
  id: string;
}

function MainPost({ post }: { post: Post }) {
  return (
    <Link href={"/read"} passHref>
      <a
        className="bg-primary bg-opacity-10 flex flex-col sm:flex-row w-full shadow-lg
        hover:bg-opacity-40 transition-all group rounded-xl overflow-hidden
        "
      >
        <figure className="w-full h-60 sm:w-72 aspect-square sm:h-auto overflow-hidden">
          <img
            className="w-full h-full max-w-none group-hover:scale-110 transition-transform object-cover"
            src={`https://picsum.photos/id/${post.id}/500/300`}
            alt="Image"
            width={240}
            height={240}
          />
        </figure>
        <div className="flex flex-col gap-4 p-4 flex-1">
          <h1 className="text-xl sm:text-3xl font-bold group-hover:underline">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          </h1>
          <span className="text-sm sm:text-base">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque,
            commodi? Suscipit illum maxime, repellat inventore et distinctio
            porro.
          </span>
          <div className="flex flex-wrap gap-4 font-extralight">
            <span className="">2d ago</span>
            <span className="">2mins read</span>
            <span className="">Technology</span>
          </div>
          <div className="flex flex-row justify-between items-center">
            <button
              className="ml-auto btn btn-neutral font-bold
            text-lg normal-case bg-opacity-50 btn-outline
            group-hover:opacity-100 opacity-80"
            >
              Read more
            </button>
          </div>
        </div>
      </a>
    </Link>
  );
}

export default MainPost;
