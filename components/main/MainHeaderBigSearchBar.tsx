import { Combobox, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { MdSearch } from "react-icons/md";
import { ArticleModel } from "../../utils/data/models/ArticleModel";
import { dateDistanceGet } from "../../utils/helpers/MainHelpers";
import { fbArticleSearch } from "../../utils/services/network/FirebaseApi/ArticleModules";
import InputText from "../input/InputText";
import LoadingIndicator from "../placeholder/LoadingIndicator";

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
  const searchBarRef = useRef<HTMLInputElement>(null);
  const searchBar = searchBarRef.current;

  // for axios request of fbAritcleSearch
  let controller = new AbortController();

  const debounceSearch = useCallback(
    debounce(async (str: string, abortSignal: AbortSignal) => {
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
      setResult(res);
      setLoading(false);
    }, 500),
    [],
  );

  const handleSearch = useCallback(
    async (ev: React.ChangeEvent<HTMLInputElement>) => {
      // console.log(ev.target.value);
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

  function handleKeyPress(ev: KeyboardEvent) {
    // console.log(ev);
    if (ev.ctrlKey) {
      if (ev.key === "/") {
        if (searchBar) {
          searchBar.focus();
        }
      }
    }
  }

  function toggleSmBreakpoint() {
    if (window.innerWidth < 768) {
      setSmBreakpoint(true);
    } else {
      setSmBreakpoint(false);
    }
  }

  useEffect(() => {
    if (smBreakpoint) {
      window.removeEventListener("keydown", handleKeyPress);
    } else {
      if (searchBar) window.addEventListener("keydown", handleKeyPress);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [smBreakpoint,searchBar]);

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
              router.push(`/article/${e.slug}`);
              setSearch("");
            }}
          >
            <div className="relative">
              <Combobox.Input
                ref={searchBarRef}
                onChange={handleSearch}
                placeholder="Search - CTRL + /"
                icon={<MdSearch />}
                // clearIcon
                // clearable={search.trim().length >= 2}
                // clearAction={clear}
                minLength={2}
                className="bg-opacity-50 md:w-96 lg:w-[30rem]"
                displayValue={(e) => search}
                value={search}
                // displayValue={(person) => person.name}
                as={InputText}
              ></Combobox.Input>

              <Combobox.Options
                className="absolute mt-1 max-h-60 w-full overflow-auto bg-base-100 rounded-xl p-1 shadow-lg 
                ring-1 ring-base-content/10 focus:outline-none list-none gap-1 flex flex-col"
                as={"div"}
              >
                {/* {!result.length && (
                <div className="font-bold text-center text-xl">No result found.</div>
              )} */}
                {loading && (
                  <LoadingIndicator spinner text="Searching articles..." />
                )}
                {!loading &&
                  result.map((e, idx) => {
                    return (
                      <Combobox.Option
                        key={e.id + idx}
                        value={e}
                        className={({ active }) =>
                          `relative cursor-default select-none rounded-xl overflow-hidden
                        ${active ? ` bg-primary/50` : ``}
                        `
                        }
                      >
                        {({ selected, active }) => (
                          <>
                            {!result.length && <div>No result found.</div>}
                            {result.length && (
                              <div className="flex gap-4 relative">
                                <img
                                  className="h-full aspect-video rounded-xl  absolute inset-0"
                                  src={
                                    e.thumbnail ||
                                    `https://picsum.photos/id/${e.dateAdded
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
                                {/* <Link  href={`/article/${e.slug}`}> */}
                                <div
                                  className={`flex flex-col z-[1] p-4 gap-4 w-full ${
                                    active ? "underline" : ""
                                  }`}
                                >
                                  <div className="font-bold text-lg line-clamp-2">
                                    {e.title}
                                  </div>
                                  <div className="self-end">{`${dateDistanceGet(
                                    e.dateAdded,
                                    Date.now(),
                                  )} ago`}</div>
                                </div>
                                {/* </Link> */}
                              </div>
                            )}
                          </>
                        )}
                      </Combobox.Option>
                    );
                  })}
              </Combobox.Options>
            </div>
          </Combobox>
          {/* <div
            className={
              `absolute mt-[3.5rem] bg-base-100 ring-1 ring-gray-600/20 w-full
            rounded-xl shadow-lg shadow-base-content/20 overflow-hidden transition-all animate-fadeIn
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
