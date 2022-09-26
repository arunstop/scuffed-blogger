import { useState } from "react";
import { ArticleModel } from "../../utils/data/models/ArticleModel";
import { dateDistanceGet } from "../../utils/helpers/MainHelpers";
import { getElById } from "../../utils/helpers/UiHelpers";
import MainIntersectionObserverTrigger from "../main/MainIntersectionObserverTrigger";

interface PostItemSearchResultProps {
  article: ArticleModel;
  active?: boolean;
  observe: boolean;
}
function PostItemSearchResult({
  article,
  active,
  observe,
}: PostItemSearchResultProps) {
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
      {visible && (
        <PostItemSearchResultContent article={article} active={active} />
      )}
    </MainIntersectionObserverTrigger>
  ) : (
    <PostItemSearchResultContent article={article} active={active} />
  );
}

function PostItemSearchResultContent({
  article,
  active,
}: Omit<PostItemSearchResultProps, "observe">) {
  const duration = Math.ceil(article.duration);
  return (
    <div
      className="flex gap-4 relative rounded-xl overflow-hidden animate-fadeIn animate-duration-500 cursor-pointer
  ring-1 ring-base-content/10"
    >
      <img
        className="h-full aspect-video rounded-xl  absolute inset-0 bg-base-content/30"
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
        <div className="block text-xs sm:text-sm [&>b]:mx-[0.25rem] line-clamp-1 font-medium self-end text-end">
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
      </div>
      {/* </Link> */}
    </div>
  );
}

export default PostItemSearchResult;
