import debounce from "lodash/debounce";
import Link from "next/dist/client/link";
import React, { useCallback, useState } from "react";
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

  const [search, setSearch] = useState("");
  const [articles, setArticles] = useState<ArticleModel[] | null>(null);
  const [loading, setLoading] = useState(false);
  // for axios request of fbAritcleSearch
  let controller = new AbortController();

  const debounceSearch = debounce(
    async (str: string, abortSignal: AbortSignal) => {
      const res = await fbArticleSearch({
        data: {
          abortSignal: controller.signal,
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
      if (controller.signal.aborted) controller = new AbortController();
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
      className="!z-20"
    >
      <div className="flex flex-col gap-2 sm:gap-4 pb-[3rem] sm:pb-0">
        <div className="form-control">
          <div className="inline-flex items-center gap-2 sm:gap-4">
            <InputText
              value={search}
              onChange={handleSearch}
              placeholder="Search articles..."
              icon={loading ? <MdWorkspaces /> : <MdSearch />}
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
          {search.length >= 2 && (
            <>
              {!articles?.length && (
                <MainSectionSkeleton text="No result found." />
              )}
              {articles &&
                articles.map((e, idx) => {
                  return (
                    <Link key={idx} href={`/article/${e.slug}`} passHref>
                      <a className="hover:underline bg-base-100 rounded-xl animate-[]">
                        <PostItemSearchResult article={e} active={false} />
                      </a>
                    </Link>
                  );
                })}
            </>
          )}
        </div>
      </div>
    </ModalTemplate>
  );
});

export default SearchModal;
