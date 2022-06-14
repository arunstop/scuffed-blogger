import React, { useCallback, useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import { MainModalProps } from "../../utils/data/Main";
import MainTextInput from "../input/MainTextInput";
import MainSearchSuggestionItem from "./MainSearchSuggestionItem";
import MainSectionSkeleton from "./MainSectionSkeleton";
import ModalTemplate from "./ModalTemplate";

export const searchSuggestionDummy = [
  "Lorem ipsum dolor sit amet",
  "consectetur adipisicing elit",
  "Harum odio, laudantium sed",
  "voluptatem eaque quisquam",
  "delectus voluptates quaerat ",
  "doloribus placeat libero excepturi",
  "unde quae blanditiis accusamus",
  "maxime, aspernatur debitis nesciunt",
];

const SearchModal = React.memo(function SearchModal(props: MainModalProps) {
  // const router = useRouter();
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
  }, [props.value]);

  const filteredData = searchSuggestionDummy.filter((e) =>
    search === ""
      ? true
      : e.toLowerCase().includes(search.trim().toLowerCase()),
  );
  return (
    <ModalTemplate {...props} title="Search Tuturku" fullscreen>
      <div className="flex flex-col gap-2 sm:gap-4">
        <div className="form-control">
          <div className="inline-flex items-center gap-2 sm:gap-4">
            <MainTextInput
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
          {!filteredData.length && (
            <MainSectionSkeleton text="No result found." />
          )}
          {filteredData.map((e, idx) => {
            return (
              <MainSearchSuggestionItem key={idx} val={e} idx={idx}/>
            );
          })}
        </div>
      </div>
    </ModalTemplate>
  );
});

export default SearchModal;
