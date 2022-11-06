import debounce from "lodash/debounce";
import { useRouter } from "next/dist/client/router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { MdClearAll, MdSearch, MdWorkspaces } from "react-icons/md";
import { autoRetry } from "../../../app/helpers/MainHelpers";
import { useUiModalSearchBehaviorHook } from "../../../app/hooks/UiModalSearchBehaviorHook";
import {
  ArticleModelFromDb,
  serviceArticleSearch,
} from "../../../app/services/ArticleService";
import Alert from "../common/Alert";
import InputText from "../input/InputText";
import ModalTemplate from "../modal/ModalTemplate";
import LoadingIndicator from "../placeholder/LoadingIndicator";
import SectionSkeleton from "../placeholder/SectionSkeleton";
import PostItemSearchResult from "../post/PostItemSearchResult";
import { InfiniteLoader } from "../utils/InfiniteLoader";
import MobileHeader, { MobileHeaderActionProps } from "./MobileHeader";

const SearchModal = React.memo(function SearchModal() {
  const { searchModal, closeSearchModal } = useUiModalSearchBehaviorHook();
  const router = useRouter();
  const searchBarRef = useRef<HTMLInputElement>(null);
  const [keyword, setKeyword] = useState("");
  const [articles, setArticles] = useState<ArticleModelFromDb | null>(null);
  const [loading, setLoading] = useState(false);
  // for axios request of fbAritcleSearch
  const controllerRef = useRef<AbortController>(new AbortController());
  const data = articles?.articles;
  const debounceSearch = debounce(
    async ({
      keyword,
      count,
      start,
      abortSignal,
      init,
    }: {
      keyword: string;
      start: number;
      count: number;
      abortSignal: AbortSignal;
      init: boolean;
    }) => {
      const res = await autoRetry(
        async () =>
          await serviceArticleSearch({
            data: {
              abortSignal: abortSignal,
              start: start,
              count: count,
              keyword: keyword,
            },
          }),
      );
      if (!res || !res?.articles.length) {
        setArticles(null);
        setLoading(false);
        return;
      }
      setArticles((prev) => {
        console.log(res.offset);
        if (!prev || init) return res;
        return {
          ...res,
          articles: [...prev.articles, ...res.articles],
        };
      });
      setLoading(false);
    },
    500,
  );

  const search = useCallback(
    (val: string, repeat?: boolean) => {
      setKeyword(val);
      // min 2 chars to proceeds
      if (val.trim().toLowerCase().length < 2) return;
      setLoading(true);
      const controller = controllerRef.current;
      if (controller.signal.aborted)
        controllerRef.current = new AbortController();
      // console.log(val.length);
      if (!val.length) {
        setLoading(false);
        // console.log("cancel search");
        return controller.abort("Idk");
      }
      debounceSearch({
        keyword: val,
        start: articles?.offset || 0,
        count: 2,
        abortSignal: controller.signal,
        init: !repeat,
      });
    },
    [articles],
  );

  const handleSearch = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      search(ev.target.value);
    },
    [],
  );

  const scrollContentToTop = useCallback(() => {
    const ElModalContent = document.getElementById("modal-content");
    if (ElModalContent)
      return ElModalContent.scrollTo({
        top: 0,
        behavior: "smooth",
      });
  }, []);

  const headerActions: MobileHeaderActionProps[] = useMemo(() => {
    return [
      {
        label: "Clear history",
        action() {
          scrollContentToTop();
          setArticles(null);
          setKeyword("");
          // alert('creating articles');
        },
        icon: <MdClearAll />,
        disabled: !articles?.articles.length && keyword.length,
      },
    ] as MobileHeaderActionProps[];
  }, [articles]);

  return (
    <ModalTemplate
      value={searchModal}
      onClose={closeSearchModal}
      title="Search Articles"
      fullscreen
      className="!z-[13]"
      noHeader
      initialFocus={searchBarRef}
    >
      <MobileHeader
        back={() => {
          closeSearchModal();
        }}
        title={`Search Articles`}
        actions={headerActions}
        toTop={scrollContentToTop}
      />
      <div className="flex flex-col gap-2 sm:gap-4 pb-[3rem] sm:pb-0 p-4 z-0">
        <div className="form-control">
          <div className="inline-flex items-center gap-2 sm:gap-4">
            <InputText
              ref={searchBarRef}
              value={keyword}
              onChange={handleSearch}
              placeholder="Search articles..."
              icon={
                loading ? (
                  <MdWorkspaces className="animate-twSpin animate-infinite" />
                ) : (
                  <MdSearch />
                )
              }
              clearIcon
              clearable={keyword.trim().length >= 2}
              clearAction={() => setKeyword("")}
              type={`search`}
            />
            {/* <button
            className="btn btn-primary --btn-resp"
            onClick={}
          >
            Cancel
          </button> */}
          </div>
        </div>
        {/* initial skeleton */}
        {!data?.length && !loading && keyword.length < 2 && (
          <Alert className="text-center mt-12">
            <span>
              Start searching by typing the keyword.
              <br />
              Keyword requires 2 characters minimum
            </span>
          </Alert>
        )}
        {/* no result */}
        {!data?.length && !loading && keyword.length >= 2 && (
          <SectionSkeleton text="No results found." />
        )}
        {articles && (
          <InfiniteLoader
            className="flex flex-col gap-2 rounded-xl min-h-screen"
            callback={(intersecting) => {
              if (intersecting) return search(keyword, true);
            }}
            loaderKey={articles.offset}
            loaderShown={articles.offset < articles.total}
            loaderChildren={<LoadingIndicator spinner />}
          >
            {data?.map((e, idx) => {
              return (
                <div
                  key={e.id + idx}
                  className="hover:underline bg-base-100 rounded-xl animate-pop"
                  onClick={() => {
                    const body = document.body;
                    body.scrollTo({ top: 0 });
                    router.push(`/article/${e.slug}/`);
                  }}
                >
                  <PostItemSearchResult article={e} active={false} />
                </div>
              );
            })}
          </InfiniteLoader>
        )}
      </div>
    </ModalTemplate>
  );
});

export default SearchModal;
