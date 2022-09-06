import React from "react";
import { ArticleModel } from "../../utils/data/models/ArticleModel";
import MainMarkdownContainer from "../main/MainMarkdownContainer";

function ArticleContent({ article }: { article: ArticleModel }) {
  return (
    <>
      <h1 className="text-3xl font-black sm:text-4xl">
        {article?.title || `Article's Title`}
      </h1>
      <h2 className="text-xl font-semibold sm:text-2xl">
        {article?.desc ||
          `Article's Description`}
      </h2>
      <div className="flex flex-col gap-2 sm:gap-4">
        <figure className="relative aspect-video w-full overflow-hidden rounded-xl">
          <img
            className="h-full w-full max-w-none object-cover transition-transform group-hover:scale-[1.2] bg-primary"
            src={
              article?.thumbnail ||
              `https://picsum.photos/id/${Math.floor(
                Math.random() * 10,
              )}/500/300`
            }
            alt="Image"
            width={240}
            height={240}
          />
        </figure>
        {/* <span className="text-center text-sm opacity-70 sm:text-base">
          {`Article's Content`}
        </span> */}
      </div>
      <MainMarkdownContainer
        content={decodeURIComponent(article?.content || "Article's Content")}
      />
    </>
  );
}

export default ArticleContent;
