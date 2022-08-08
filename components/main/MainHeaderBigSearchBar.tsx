import { Transition } from "@headlessui/react";
import React, { useCallback, useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import { SEARCH_SUGGESTIONS_DUMMY } from "../../utils/helpers/Constants";
import InputText from "../input/InputText";
import MainSearchSuggestionItem from "./MainSearchSuggestionItem";
import MainSectionSkeleton from "./MainSectionSkeleton";

function MainHeaderBigSearchBar() {
  const [search, setSearch] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [smBreakpoint, setSmBreakpoint] = useState(false);

  const clear = useCallback(() => {
    setSearch("");
    // setShowSuggestion(true);
  }, []);

  const onChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(ev.target.value);
    setShowSuggestion(true);
  }, []);

  const filteredData = SEARCH_SUGGESTIONS_DUMMY.filter((e) =>
    search === ""
      ? true
      : e.title.toLowerCase().includes(search.trim().toLowerCase()),
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
            value={search}
            onChange={onChange}
            placeholder="Search - CTRL + /"
            icon={<MdSearch />}
            clearIcon
            clearable={search.trim().length >= 2}
            clearAction={clear}
            minLength={2}
            className="bg-opacity-50 md:w-96 lg:w-[30rem]"
            onFocus={(_) => {
              setShowSuggestion(true);
            }}
            onBlur={(_) => {
              setTimeout(() => {
                if (showSuggestion) setShowSuggestion(false);
                clear();
              }, 100);
              //   setShowSuggestion(false);
            }}
          />

          <Transition
            show={showSuggestion && search.trim().length >= 2}
            as={"div"}
            className={`absolute mt-[3.5rem] bg-base-100 ring-1 ring-gray-600/20 w-full
            rounded-xl shadow-lg shadow-base-content/20 overflow-hidden transition-all`}
            enter="ease-out duration-200"
            enterFrom="opacity-0 -translate-y-72 scale-125"
            enterTo="opacity-100 -translate-y-0 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="flex max-h-[24rem] min-h-[12rem] flex-col
                divide-y divide-gray-600/20 overflow-auto p-4 transition-all"
            >
              {!filteredData.length && (
                <MainSectionSkeleton text="No result found." />
              )}
              {filteredData.map((e, idx) => {
                return (
                  <MainSearchSuggestionItem key={idx} val={e.title} id={e.id} />
                );
              })}
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  );
}

export default MainHeaderBigSearchBar;
