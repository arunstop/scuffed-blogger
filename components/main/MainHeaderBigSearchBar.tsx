import React, { useCallback, useState } from "react";
import { MdSearch } from "react-icons/md";
import MainTextInput from "../input/MainTextInput";
import MainSearchSuggestionItem from "./MainSearchSuggestionItem";
import MainSectionSkeleton from "./MainSectionSkeleton";
import { searchSuggestionDummy } from "./SearchModal";

function MainHeaderBigSearchBar() {
  const [search, setSearch] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const clear = useCallback(() => {
    setSearch("");
  }, []);

  const onChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(ev.target.value);
  }, []);

  const filteredData = searchSuggestionDummy.filter((e) =>
    search === ""
      ? true
      : e.toLowerCase().includes(search.trim().toLowerCase()),
  );
  //   const showResult;

  return (
    <div className="text-base-content hidden md:block">
      <div className="form-control">
        <div className="flex flex-col items-center gap-2 sm:gap-4 relative">
          <MainTextInput
            value={search}
            onChange={onChange}
            placeholder="Search articles..."
            icon={<MdSearch />}
            clearIcon
            clearable={search.trim().length >= 2}
            clearAction={clear}
            className="md:w-96 lg:w-[30rem]"
            onFocus={(ev) => {
              setShowSuggestion(true);
            }}
            onBlur={(ev) => {
                
              setTimeout(() => {setShowSuggestion(false);}, 100);
            // setShowSuggestion(false);
              
            }}
          />
          {showSuggestion && (
            <div
              className={`absolute mt-12 bg-base-100 ring-1 ring-gray-600/20 w-full
              rounded-xl shadow-lg shadow-base-content/20 overflow-hidden`}
            >
              <div
                className="flex flex-col divide-y divide-gray-600/20 
                overflow-auto min-h-[12rem] max-h-[24rem] p-4"
              >
                {!filteredData.length && (
                  <MainSectionSkeleton text="No result found." />
                )}
                {filteredData.map((e, idx) => {
                  return (
                    <MainSearchSuggestionItem key={idx} val={e} idx={idx} />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainHeaderBigSearchBar;
