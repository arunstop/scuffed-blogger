import { ArticleModel } from "../../utils/data/models/ArticleModel";
import { dateDistanceGet } from "../../utils/helpers/MainHelpers";

function PostItemSearchResult({
  article,
  active,
}: {
  article: ArticleModel;
  active: boolean;
}) {
  return (
    <div className="flex gap-4 relative rounded-xl overflow-hidden animate-fadeIn animate-duration-500">
      <img
        className="h-full aspect-video rounded-xl  absolute inset-0"
        src={
          article.thumbnail ||
          `https://picsum.photos/id/${article.dateAdded
            .toString()
            .split("")
            .slice(-2)
            .join("")}/500/300`
        }
      ></img>
      <div
        className={`h-full  inset-0  absolute  bg-gradient-to-r
                                ${
                                  active
                                    ? `w-full from-primary/50 via-primary to-transparent`
                                    : `w-[80%] from-base-100/50 via-base-100 to-base-100`
                                }
                                `}
      ></div>
      {/* <Link  href={`/article/${article.slug}`} passHref> */}
      <div
        className={`flex flex-col z-[1] p-4 gap-4 w-full ${
          active ? "underline" : ""
        }`}
      >
        <div className="font-bold text-lg line-clamp-2">{article.title}</div>
        <div className="self-end">{`${dateDistanceGet(
          article.dateAdded,
          Date.now(),
        )} ago`}</div>
      </div>
      {/* </Link> */}
    </div>
  );
}

export default PostItemSearchResult;
