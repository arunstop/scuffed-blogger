import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import { MainModalProps } from "../../utils/data/Main";
import MainTextInput from "../input/MainTextInput";
import MainSectionSkeleton from "./MainSectionSkeleton";
import ModalTemplate from "./ModalTemplate";

const dummy = [
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

  const filteredData = dummy.filter((e) =>
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
              <Link href={`/article/${idx}`} key={idx} passHref>
                <a
                  className="flex flex-col gap-2 p-2 transition-all hover:rounded-xl 
                hover:!border-transparent hover:bg-base-content/20 sm:gap-4 sm:p-4
                group
                "
                  // onClick={() => {
                  //   props.onClose();
                  //   router.push(`/article/${idx}`);
                  // }}
                  role={"button"}
                >
                  <span
                    className="text-lg font-black first-letter:uppercase 
                  sm:text-xl group-hover:underline"
                  >
                    {e} {e}
                  </span>
                  {/* <div className="inline-flex justify-between"> */}
                  <span className="text-base sm:text-lg">
                    {"Kevin Kronk"}
                    {idx % 2 === 0 && " on Photography"}
                  </span>
                  <div className="flex flex-wrap gap-x-2 sm:text-base flex-1 text-sm">
                    <span className="">2d ago</span>
                    <span className="font-black">·</span>
                    <span className="">2mins read</span>
                    <span className="font-black">·</span>
                    <span className="">Technology</span>
                  </div>
                  {/* </div> */}
                </a>
              </Link>
            );
          })}
        </div>
      </div>
    </ModalTemplate>
  );
});

export default SearchModal;
