import { Combobox, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { MdSearch, MdWorkspaces } from "react-icons/md";
import { ArticleModel } from "../../../base/data/models/ArticleModel";
import { serviceArticleSearch } from "../../../app/services/ArticleService";
import InputText from "../input/InputText";
import PostItemSearchResult from "../post/PostItemSearchResult";
import SectionSkeleton from "../placeholder/SectionSkeleton";
import { autoRetry } from "../../../app/helpers/MainHelpers";

// function debounce(callback: () => void, delay = 500) {
//   let timeout;
//   clearTimeout(timeout);
//   return (timeout = setTimeout(() => {
//     callback();
//   }, delay));
// }

const debounce = (fn: (...args: any[]) => void, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

function MainHeaderBigSearchBar() {
  const router = useRouter();
  const [smBreakpoint, setSmBreakpoint] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  // list of contentless article
  const [result, setResult] = useState<ArticleModel[]>([]);
  // search bar variables
  const [searchBar, setSearchBar] = useState<HTMLElement | null>(null);

  const onSearchBarRefChange = useCallback((node: HTMLElement | null) => {
    setSearchBar(node);
  }, []);
  // console.log(searchBar);

  // for axios request of fbAritcleSearch
  const controllerRef = useRef<AbortController>(new AbortController());

  const debounceSearch = useCallback(
    debounce(async (str: string, abortSignal: AbortSignal) => {
      const res = await autoRetry(
        async () =>
          await serviceArticleSearch({
            data: {
              abortSignal: abortSignal,
              count: 5,
              start: 0,
              keyword: str,
            },
          }),
      );
      if (!res||!res.articles.length) return;
      // console.log(res);
      setResult(res.articles);
      setLoading(false);
    }, 500),
    [],
  );

  const handleSearch = useCallback(
    async (ev: React.ChangeEvent<HTMLInputElement>) => {
      // console.log(ev.target.value);
      setLoading(true);
      setSearch(ev.target.value);
      // set new controller
      const controller = controllerRef.current;
      if (controller.signal.aborted)
        controllerRef.current = new AbortController();
      const val = ev.target.value;
      // console.log(val.length);
      if (!val.length) {
        setLoading(false);
        // console.log("cancel search");
        return controller.abort("cancelled by user");
      }
      debounceSearch(val, controller.signal);
    },
    [],
  );

  const handleKeyPress = useCallback(
    (ev: KeyboardEvent) => {
      if (ev.ctrlKey) {
        if (ev.key === "/") {
          if (searchBar) {
            searchBar.focus();
          }
        }
      }
    },
    [searchBar],
  );

  function toggleSmBreakpoint() {
    if (window.innerWidth < 640) {
      setSmBreakpoint(true);
    } else {
      setSmBreakpoint(false);
    }
  }

  useEffect(() => {
    // console.log(searchBar);
    if (smBreakpoint) {
      window.removeEventListener("keydown", handleKeyPress);
    } else {
      window.addEventListener("keydown", handleKeyPress);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [smBreakpoint, searchBar]);

  useEffect(() => {
    toggleSmBreakpoint();

    function handleResize(ev: UIEvent) {
      toggleSmBreakpoint();
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //   const showResult;

  return (
    <Transition
      show={!smBreakpoint}
      as={"div"}
      className="text-base-content"
      enter="ease-out duration-200"
      enterFrom="opacity-0 -translate-y-72 scale-125"
      enterTo="opacity-100 -translate-y-0 scale-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100 "
      leaveTo="opacity-0 "
    >
      <div className="form-control">
        <div className="relative flex flex-col items-center gap-2 sm:gap-4">
          <Combobox
            value={result[0]}
            onChange={(e) => {
              // (document.activeElement as HTMLElement).blur();
              // setSearch("");
              router.push(`/article/${e.slug}`);
            }}
          >
            <div className="relative">
              <Combobox.Input
                ref={onSearchBarRefChange}
                onChange={handleSearch}
                placeholder="Search - CTRL + /"
                icon={
                  !loading ? (
                    <MdSearch />
                  ) : (
                    <MdWorkspaces className="animate-twSpin animate-infinite" />
                  )
                }
                // clearIcon
                // clearable={search.trim().length >= 2}
                // clearAction={clear}
                minLength={2}
                className="bg-opacity-50  sm:w-80 md:w-96 lg:w-[30rem]"
                // displayValue={(e) => search}
                value={search}
                // displayValue={(person) => person.name}
                as={InputText}
                autoComplete="off"
              ></Combobox.Input>

              <Combobox.Options
                className={`absolute mt-1 overflow-hidden w-full bg-base-100 rounded-xl shadow-lg 
                ring-2 ring-base-content/10 focus:outline-none 
                ${search.length ? "" : "hidden"}`}
                as={"div"}
              >
                {/* {!result.length && (
                <div className="font-bold text-center text-xl">No result found.</div>
              )} */}
                {/* {loading && (
                  <LoadingIndicator spinner text="Searching articles..." />
                )} */}
                {!result.length && !!search.length && (
                  <SectionSkeleton text="No result found." />
                )}
                <div className=" gap-1 flex flex-col list-none max-h-60 w-full overflow-auto p-1">
                  {!!result.length &&
                    result.map((e, idx) => {
                      return (
                        <Combobox.Option
                          key={e.id + idx}
                          value={e}
                          className={({ active }) =>
                            ` rounded-xl
                          ${active ? ` bg-primary/50` : ``}`
                          }
                        >
                          {({ selected, active }) => (
                            <PostItemSearchResult article={e} active={active} />
                          )}
                        </Combobox.Option>
                      );
                    })}
                </div>
              </Combobox.Options>
            </div>
          </Combobox>
          {/* <div
            className={
              `absolute mt-[3.5rem] bg-base-100 ring-1 ring-gray-600/20 w-full
            rounded-xl shadow-lg shadow-base-content/20 o verflow-hidden transition-all animate-fadeIn
            animate-duration-300 ` + //
              `${showResult ? "block z-20" : "hidden"}`
            }
          >
            <div
              className="max-h-[24rem] min-h-[12rem] flex-col divide-y divide-gray-600/20 overflow-auto p-4 
            transition-all  flex"
            >
              {!result.length && (
                <MainSectionSkeleton text="No result found." />
              )}
              {result.map((e, idx) => {
                return (
                  <MainSearchSuggestionItem
                    key={e.id + idx}
                    val={e.title}
                    id={e.id}
                  />
                );
              })}
            </div>
          </div> */}
        </div>
      </div>
    </Transition>
  );
}

export default MainHeaderBigSearchBar;
