import React, { useCallback, useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import { SEARCH_SUGGESTIONS_DUMMY } from "../../utils/helpers/Constants";
import { useUiModalSearchBehaviorHook } from "../../utils/hooks/UiModalSearchBehaviorHook";
import InputText from "../input/InputText";
import ModalTemplate from "../modal/ModalTemplate";
import MainSearchSuggestionItem from "./MainSearchSuggestionItem";
import MainSectionSkeleton from "./MainSectionSkeleton";

const SearchModal = React.memo(function SearchModal() {
  const { searchModal, closeSearchModal } = useUiModalSearchBehaviorHook();

  const [search, setSearch] = useState("");
  const clear = useCallback(() => {
    setSearch("");
  }, []);

  const onChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(ev.target.value);
  }, []);

  useEffect(() => {
    clear();
    return () => {};
  }, [searchModal]);

  const filteredData = SEARCH_SUGGESTIONS_DUMMY.filter((e) =>
    search === ""
      ? true
      : e.title.toLowerCase().includes(search.trim().toLowerCase()),
  );
  return (
    <ModalTemplate value={searchModal} onClose={closeSearchModal} title="Search Tuturku" fullscreen className='!z-10'>
      <div className="flex flex-col gap-2 sm:gap-4 pb-[3rem] sm:pb-0">
        <div className="form-control">
          <div className="inline-flex items-center gap-2 sm:gap-4">
            <InputText
              value={search}
              onChange={onChange}
              placeholder="Search articles..."
              icon={<MdSearch />}
              clearIcon
              clearable={search.trim().length >= 2}
              clearAction={clear}
            />
            {/* <button
            className="btn btn-primary --btn-resp"
            onClick={}
          >
            Cancel
          </button> */}
          </div>
        </div>
        <div className="flex flex-col divide-y divide-gray-600/20 min-h-screen">
          {search.length >= 2 && (
            <>
              {!filteredData.length && (
                <MainSectionSkeleton text="No result found." />
              )}
              {filteredData.map((e, idx) => {
                return (
                  <MainSearchSuggestionItem key={idx} val={e.title} id={e.id} />
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
