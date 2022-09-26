import Link from "next/dist/client/link";
import { HTMLAttributes, useState } from "react";
import { MdDelete, MdEdit, MdVisibility } from "react-icons/md";
import { ArticleModel } from "../../utils/data/models/ArticleModel";
import { dateDistanceGet } from "../../utils/helpers/MainHelpers";
import { getElById } from "../../utils/helpers/UiHelpers";
import MainIntersectionObserverTrigger from "../main/MainIntersectionObserverTrigger";

interface PostItemSearchResultProps {
  article: ArticleModel;
  active?: boolean;
  observe?: boolean;
}
function PostItemSearchResult({
  article,
  active,
  observe,
  ...props
}: PostItemSearchResultProps & HTMLAttributes<HTMLDivElement>) {
  const [visible, setVisible] = useState(true);
  const elementId = `article-${article.id}`;
  const element = getElById(elementId);
  return observe ? (
    <MainIntersectionObserverTrigger
      id={elementId}
      callback={(intersecting) => setVisible(intersecting)}
      {...props}
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
      className="group relative flex animate-fadeIn cursor-pointer gap-4 overflow-hidden rounded-xl
      ring-1 ring-base-content/10 animate-duration-500"
    >
      <img
        className="absolute inset-0 aspect-video  h-full rounded-xl bg-base-content/30"
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
        <div className="text-lg font-bold line-clamp-2">{article.title}</div>
        <div className="block self-end text-end text-xs font-medium line-clamp-1 sm:text-sm [&>b]:mx-[0.25rem]">
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
      {/* Actions */}
      <div className=" absolute inset-0 z-[2] hidden bg-primary/30 backdrop-blur-lg animate-fadeIn  animate-duration-500  group-hover:flex">
        {/* <div className="blur-lg z-10 absolute bg-primary/90 inset-0"></div> */}
        <div className="m-auto  grid grid-cols-3 gap-2 px-4 sm:gap-4 sm:px-8">
          <div className="animate-fadeInUp animate-duration-500 animate-delay-200">
            <Link href={`/article/${article.slug}`} passHref>
              <a
                className="btn-sm btn gap-2 rounded-xl sm:btn-md sm:gap-4 !flex !flex-col !h-auto p-2  flex-nowrap
              sm:!flex-row w-full "
              >
                <MdVisibility className="text-2xl sm:text-3xl" />
                <span className="font-bold">Read</span>
              </a>
            </Link>
          </div>
          <div className="animate-fadeInUp animate-duration-500 animate-delay-300">
            <Link href={`/article/edit/${article.id}`} passHref>
              <a
                className="btn-sm btn gap-2 rounded-xl sm:btn-md sm:gap-4 !flex !flex-col !h-auto p-2  flex-nowrap
              sm:!flex-row w-full btn-primary"
              >
                <MdEdit className="text-2xl sm:text-3xl" />
                <span className="font-bold">Edit</span>
              </a>
            </Link>
          </div>
          <div className="animate-fadeInUp animate-duration-500 animate-delay-[400ms]">
            <Link
              href={{
                query: {
                  articleId: article.id,
                },
              }}
              shallow
              passHref
            >
              <a
                className="btn-sm btn gap-2 rounded-xl sm:btn-md sm:gap-4 !flex !flex-col !h-auto p-2  flex-nowrap
              sm:!flex-row w-full btn-error"
              >
                <MdDelete className="text-2xl sm:text-3xl" />
                <span className="font-bold">Delete</span>
              </a>
            </Link>
          </div>
        </div>
      </div>
      {/* </Link> */}
    </div>
  );
}

export default PostItemSearchResult;
