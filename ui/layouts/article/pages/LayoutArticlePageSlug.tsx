import { formatDistance } from "date-fns";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import {
  MdForum,
  MdMoreVert,
  MdRefresh,
  MdStar,
  MdTrendingUp,
} from "react-icons/md";
import { useAuthCtx } from "../../../../app/contexts/auth/AuthHook";
import { autoRetry } from "../../../../app/helpers/MainHelpers";
import { routeHistoryAtom } from "../../../../app/hooks/RouteChangeHook";
import {
  serviceArticleContentGet,
  serviceArticleUpdateView,
} from "../../../../app/services/ArticleService";
import { ArticleModel } from "../../../../base/data/models/ArticleModel";
import ArticleSectionAction from "../../../components/article/ArticleActions";
import ArticleProgressBar from "../../../components/article/ArticleProgressBar";
import Container from "../../../components/common/Container";
import Dropdown, { DropdownOption } from "../../../components/common/Dropdown";
import MainMarkdownContainer from "../../../components/main/MainMarkdownContainer";
import MainPostStatusChip from "../../../components/main/MainPostFilterChip";
import MainUserPopup from "../../../components/main/MainPostUserPopup";
import MobileHeader, {
  MobileHeaderActionProps,
} from "../../../components/main/MobileHeader";
import ModalImagePreview from "../../../components/modal/ModalImagePreview";
import LoadingIndicator from "../../../components/placeholder/LoadingIndicator";
import UserHeader from "../../../components/user/UserHeader";
import IntersectionObserverTrigger from "../../../components/utils/IntesectionObserverTrigger";
import Memoized from "../../../components/utils/Memoized";
import LayoutArticleMoreSection from "../LayoutArticleMoreSection";

function LayoutArticlePageSlug({
  articleContentless,
}: {
  articleContentless: ArticleModel;
}) {
  const articleId = articleContentless.id;
  const {
    authStt: { user },
  } = useAuthCtx();
  const router = useRouter();
  const [history] = useAtom(routeHistoryAtom);

  const [article, setArticle] = useState(articleContentless);

  const getContent = useCallback(async () => {
    const content = await autoRetry(
      async (attempt, max) =>
        await serviceArticleContentGet({ id: article.id }),
    );
    if (content) {
      setArticle((prev) => ({ ...prev, content: content }));
      await serviceArticleUpdateView({
        data: { id: article.id },
      });
    }
  }, []);

  const getUserOptions = (isAuthor: boolean): DropdownOption[] => {
    if (isAuthor)
      return [
        {
          label: "Edit",
          action() {
            router.push(`/article/edit/${articleId}`);
          },
        },
        // {
        //   label: "Delete",
        //   action() {
        //     alert("should delete");
        //   },
        // },
      ];
    return [
      {
        label: "Report Article",
        action() {
          alert("should report article");
        },
        confirmation: {
          title: "Report article",
          desc: "Are you sure you want to report this article, because of some reason?",
        },
      },
      {
        label: "Report Author",
        action() {
          alert("should report author");
        },
      },
    ];
  };

  const getHeaderAction = (): MobileHeaderActionProps[] | undefined => {
    const actions: MobileHeaderActionProps[] = [
      {
        label: "Reload",
        icon: <MdRefresh />,
        action() {
          router.reload();
        },
      },
      {
        label: "Options",
        icon: <MdMoreVert />,
      },
    ];

    if (articleContentless.author === user?.id) {
      const options = actions.pop();
      if (!options) return;

      options.options = getUserOptions(true);
      actions.push(options);
      return actions;
    }
    const actionOptions = actions.pop();
    console.log(actionOptions);
    if (!actionOptions) return;

    actionOptions.options = getUserOptions(false);
    actions.push(actionOptions);
    return actions;
  };

  // reload article content on slug change
  useEffect(() => {
    // removing article content

    setArticle((prev) => ({ ...prev, content: "" }));
  }, [articleId]);

  return (
    <>
      <ArticleProgressBar />
      <MobileHeader
        back={() =>
          history.length
            ? router.replace(history[history.length - 1])
            : router.push("/")
        }
        title="Read Article"
        actions={getHeaderAction()}
      />
      <Container>
        <div className="inline-flex justify-between">
          <div className="dropdown-hover dropdown">
            <Memoized show>
              <UserHeader id={article.author} />
            </Memoized>

            <div tabIndex={0} className="dropdown-content pt-2">
              <MainUserPopup id={articleId + ""} />
            </div>
          </div>
          <div className="hidden sm:flex">
            <Dropdown
              options={getUserOptions(user?.id === articleContentless.author)}
              className="dropdown-end"
            >
              <button
                tabIndex={0}
                className="btn-ghost btn aspect-square rounded-xl p-0 opacity-80 hover:opacity-100"
              >
                <MdMoreVert className="text-2xl sm:text-3xl"></MdMoreVert>
              </button>
            </Dropdown>
          </div>
        </div>

        <div className="block text-base sm:text-lg [&>.separator]:mx-[0.5rem]">
          <span className="first-letter:uppercase">
            {`${formatDistance(article.dateAdded, Date.now())} ago`}
          </span>
          <span className="separator font-black">&middot;</span>
          <span className="">{`${Math.ceil(article.duration)} min${
            Math.ceil(article.duration) >= 2 ? "s" : ""
          } read`}</span>
          <span className="separator font-black">&middot;</span>
          <span className="">{`${article.topics?.join(", ")}`}</span>
        </div>

        <div className=" flex flex-wrap justify-start gap-2 overflow-hidden">
          <MainPostStatusChip
            icon={<MdStar className="text-xl sm:text-2xl" />}
            title="299 Favorited"
            color="bg-yellow-500"
          />
          <MainPostStatusChip
            icon={<MdTrendingUp className="text-xl sm:text-2xl" />}
            title="Trending"
            color="bg-red-500"
          />
          <MainPostStatusChip
            icon={<MdForum className="text-xl sm:text-2xl" />}
            title="Actively Discussing"
            color="bg-blue-500"
          />
        </div>

        <h1 id="article-title" className="text-3xl font-black sm:text-4xl">
          {article?.title || `Article's Title`}
        </h1>
        <h2 className="text-xl font-semibold sm:text-2xl">
          {article?.desc || `Article's Description`}
        </h2>
        <div className="flex flex-col gap-2 sm:gap-4">
          <ModalImagePreview className="rounded-xl">
            <img
              className="z-10 h-full w-full max-w-none bg-primary object-cover transition-transform duration-500
              hover:scale-[1.2] group-focus-within:my-auto group-focus-within:h-auto group-focus-within:max-h-[90vh]
              group-focus-within:rounded-xl
              group-focus-within:object-fill group-focus-within:duration-[0] group-focus-within:hover:scale-100"
              src={
                article?.thumbnail ||
                `https://picsum.photos/id/${article.dateAdded
                  .toString()
                  .substring(0, -2)}/500/300`
              }
              alt="Image"
              width={240}
              height={240}
            />
          </ModalImagePreview>
        </div>

        {article.content ? (
          <>
            <MainMarkdownContainer
              content={decodeURIComponent(article?.content)}
            />
            <ArticleSectionAction article={article} />
            <LayoutArticleMoreSection article={article} />
          </>
        ) : (
          <IntersectionObserverTrigger
            callback={(intersecting) => {
              if (intersecting) {
                return getContent();
              }
            }}
          >
            <LoadingIndicator spinner text="Loading content" />
          </IntersectionObserverTrigger>
        )}
      </Container>
    </>
  );
}

export default LayoutArticlePageSlug;
