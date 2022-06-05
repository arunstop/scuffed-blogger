import React, { useCallback, useState } from "react";
import { MdSearch } from "react-icons/md";
import MainInput from "../input/MainInput";

const MainSearchBar = React.memo(function MainSearchBar() {
  // function MainSearchBar() {

  const [search, setSearch] = useState("");
  const clear = useCallback(() => {
    setSearch("");
  }, []);

  const onChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(ev.target.value);
  }, []);

  return (
    <>
      <div className="form-control">
        <div className="inline-flex gap-2">
          <MainInput
            value={search}
            onChange={onChange}
            placeholder="Search articles..."
            icon={<MdSearch />}
            clearIcon
            clearable={search.trim().length >= 2}
            clearAction={clear}
          />
          <button
            className="rounded-xl btn btn-primary text-lg 
            font-bold sm:text-xl"
          >
            Search
          </button>
        </div>
      </div>
    </>
  );
});

export default MainSearchBar;
