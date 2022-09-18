import { Transition } from "@headlessui/react";
import React, { useCallback, useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import { ArticleModel } from "../../utils/data/models/ArticleModel";
import { fbArticleSearch } from "../../utils/services/network/FirebaseApi/ArticleModules";
import InputText from "../input/InputText";
import MainSearchSuggestionItem from "./MainSearchSuggestionItem";
import MainSectionSkeleton from "./MainSectionSkeleton";

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
  const [search, setSearch] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [smBreakpoint, setSmBreakpoint] = useState(false);
  // list of contentless article
  const [result, setResult] = useState<ArticleModel[]>([]);
  let controller = new AbortController();

  const clear = useCallback(() => {
    setSearch("");
    // setShowSuggestion(true);
  }, []);

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
      console.log(res);
      setResult(res);
    }, 1000),
    [],
  );

  const handleSearch = useCallback(
    async (ev: React.ChangeEvent<HTMLInputElement>) => {
      if (controller.signal.aborted) controller = new AbortController();
      const val = ev.target.value;
      console.log(val.length);
      if (!val.length) {
        console.log("cacnel search");
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
        const searchBar = document.getElementById("main-header-big-search-bar");
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
      window.addEventListener("keydown", handleKeyPress);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [smBreakpoint]);

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
          <InputText
            id="main-header-big-search-bar"
            // value={search}
            onChange={handleSearch}
            placeholder="Search - CTRL + /"
            icon={<MdSearch />}
            clearIcon
            clearable={search.trim().length >= 2}
            clearAction={clear}
            minLength={2}
            className="bg-opacity-50 md:w-96 lg:w-[30rem] peer"
            onFocus={(_) => {
              setShowResult(true);
            }}
            onBlur={(_) => {
              setTimeout(() => {
                if (showResult) setShowResult(false);
                clear();
              }, 100);
              //   setShowSuggestion(false);
            }}
          />
          <div
            className={
              `absolute mt-[3.5rem] bg-base-100 ring-1 ring-gray-600/20 w-full
            rounded-xl shadow-lg shadow-base-content/20 overflow-hidden transition-all animate-fadeIn
            animate-duration-300 ` + //
              `${showResult ? "block" : "hidden"}`
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
          </div>
        </div>
      </div>
    </Transition>
  );
}

export default MainHeaderBigSearchBar;
