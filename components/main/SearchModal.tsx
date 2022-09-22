import debounce from "lodash/debounce";
import { useRouter } from "next/dist/client/router";
import React, { useCallback, useRef, useState } from "react";
import { MdSearch, MdWorkspaces } from "react-icons/md";
import { ArticleModel } from "../../utils/data/models/ArticleModel";
import { useUiModalSearchBehaviorHook } from "../../utils/hooks/UiModalSearchBehaviorHook";
import { fbArticleSearch } from "../../utils/services/network/FirebaseApi/ArticleModules";
import InputText from "../input/InputText";
import ModalTemplate from "../modal/ModalTemplate";
import PostItemSearchResult from "../post/PostItemSearchResult";
import MainSectionSkeleton from "./MainSectionSkeleton";

const SearchModal = React.memo(function SearchModal() {
  const { searchModal, closeSearchModal } = useUiModalSearchBehaviorHook();
  const router = useRouter();
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
      setLoading(true);
      setSearch(ev.target.value);
      const controller = controllerRef.current;
      if (controller.signal.aborted)
        controllerRef.current = new AbortController();
      const val = ev.target.value;
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

  return (
    <ModalTemplate
      value={searchModal}
      onClose={closeSearchModal}
      title="Search Tuturku"
      fullscreen
      className="!z-[13]"
    >
      <div className="flex flex-col gap-2 sm:gap-4 pb-[3rem] sm:pb-0">
        <div className="form-control">
          <div className="inline-flex items-center gap-2 sm:gap-4">
            <InputText
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
          {!articles?.length && !loading && (
            <MainSectionSkeleton text="No result found." />
          )}
          {articles &&
            articles.map((e, idx) => {
              return (
                <div
                  key={e.id}
                  className="hover:underline bg-base-100 rounded-xl animate-[button-pop_300ms_ease-out]"
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
