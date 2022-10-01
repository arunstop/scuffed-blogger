import React, { useCallback, useState } from "react";
import { MdSearch } from "react-icons/md";
import InputText from "../input/InputText";

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
        <div className="inline-flex gap-2 sm:gap-4 items-center">
          <InputText
            value={search}
            onChange={onChange}
            placeholder="Search articles..."
            icon={<MdSearch />}
            clearIcon
            clearable={search.trim().length >= 2}
            clearAction={clear}
          />
          <button
            className="btn btn-primary --btn-resp
            "
          >
            Search
          </button>
        </div>
      </div>
    </>
  );
});

export default MainSearchBar;
