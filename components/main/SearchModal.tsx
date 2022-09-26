import debounce from "lodash/debounce";
import { useRouter } from "next/dist/client/router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { MdClearAll, MdSearch, MdWorkspaces } from "react-icons/md";
import { ArticleModel } from "../../utils/data/models/ArticleModel";
import { useUiModalSearchBehaviorHook } from "../../utils/hooks/UiModalSearchBehaviorHook";
import { fbArticleSearch } from "../../utils/services/network/FirebaseApi/ArticleModules";
import InputText from "../input/InputText";
import ModalTemplate from "../modal/ModalTemplate";
import PostItemSearchResult from "../post/PostItemSearchResult";
import Alert from "./Alert";
import MainSectionSkeleton from "./MainSectionSkeleton";
import MobileHeader, { MobileHeaderActionProps } from "./MobileHeader";

const SearchModal = React.memo(function SearchModal() {
  const { searchModal, closeSearchModal } = useUiModalSearchBehaviorHook();
  const router = useRouter();
  const searchBarRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [articles, setArticles] = useState<ArticleModel[] | null>(null);
  const [loading, setLoading] = useState(false);
  // for axios request of fbAritcleSearch
  const controllerRef = useRef<AbortController>(new AbortController());
  const debounceSearch = debounce(
    async (str: string, abortSignal: AbortSignal) => {
      const res = await fbArticleSearch({
        data: {
          abortSignal: abortSignal,
          count: 5,
          start: 0,
          keyword: str,
        },
      });
      if (!res) return;
      // console.log(res);
      setArticles(res);
      setLoading(false);
    },
    500,
  );

  const handleSearch = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const val = ev.target.value;
      setSearch(ev.target.value);
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
      debounceSearch(val, controller.signal);
    },
    [],
  );

  const headerActions: MobileHeaderActionProps[] = useMemo(() => {
    return [
      {
        label: "Clear history",
        action() {
          setArticles(null);
          setSearch('');
          alert('creating articles');
        },
        icon: <MdClearAll />,
        disabled:!articles?.length,
      },
    ] as MobileHeaderActionProps[];
  }, [articles]);

  return (
    <ModalTemplate
      value={searchModal}
      onClose={closeSearchModal}
      title="Search Tuturku"
      fullscreen
      className="!z-[13]"
      noHeader
      initialFocus={searchBarRef}
    >
      <MobileHeader
        back={() => {
          closeSearchModal();
        }}
        title="Search articles"
        actions={headerActions}
      />
      <div className="flex flex-col gap-2 sm:gap-4 pb-[3rem] sm:pb-0 p-4 z-0">
        <div className="form-control">
          <div className="inline-flex items-center gap-2 sm:gap-4">
            <InputText
              ref={searchBarRef}
              value={search}
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
              clearable={search.trim().length >= 2}
              clearAction={() => setSearch("")}
            />
            {/* <button
            className="btn btn-primary --btn-resp"
            onClick={}
          >
            Cancel
          </button> */}
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-xl min-h-screen">
          {/* initial skeleton */}
          {!articles?.length && !loading && (
            <Alert className="text-center mt-12">
              <span>
                Start searching by typing the keyword.
                <br />
                Keyword requires 2 characters minimum
              </span>
            </Alert>
          )}
          {/* no result */}
          {!articles?.length && !loading && search.length >= 2 && (
            <MainSectionSkeleton text="No result found." />
          )}
          {articles &&
            articles.map((e, idx) => {
              return (
                <div
                  key={e.id}
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
        </div>
      </div>
    </ModalTemplate>
  );
});

export default SearchModal;
