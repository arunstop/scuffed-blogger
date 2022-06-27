import React from "react";
import { ArticleModel } from "../../utils/data/models/ArticleModel";
import MainMarkdownContainer from "../main/MainMarkdownContainer";

function ArticleContent({ article }: { article: ArticleModel }) {
  // const [article, setArticle] = useState<undefined | ArticleModel>();
  // useEffect(() => {
  //   const dummyArticle = JSON.parse(storageFind(KEY_ARTICLE_CONTENT));
  //   if (dummyArticle) setArticle(dummyArticle as ArticleModel);
  //   return () => {};
  // }, []);

  console.log("render Article Content");

  return (
    <>
      <h1 className="text-3xl font-black sm:text-4xl">
        {article?.title ||
          `Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium
        itaque odit sed? Quibusdam quis nemo tempora.`}
      </h1>
      <h2 className="text-xl font-semibold sm:text-2xl">
        {article?.desc ||
          `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque,
        commodi? Suscipit illum maxime, repellat inventore et distinctio porro.`}
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
        <span className="text-center text-sm opacity-70 sm:text-base">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic tempora
          alias omnis, excepturi beatae quasi aut debitis eveniet molestiae
          architecto nobis.
        </span>
      </div>
      <MainMarkdownContainer content={decodeURIComponent(article?.content || "")} />
    </>
  );
}

export default ArticleContent;
