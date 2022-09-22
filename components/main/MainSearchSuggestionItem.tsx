import Link from "next/link";
import React from "react";

function MainSearchSuggestionItem({ val, id }: { val: string; id: string }) {
  return (
    <Link href={`/article/${id}`} passHref onMouseDown={()=>alert("XD")}>
      <a
        className="group flex flex-col gap-2 p-2 transition-all 
        hover:rounded-xl hover:!border-transparent hover:bg-base-content/20 sm:gap-4
        sm:p-4  "
        // onClick={() => {
        //   props.onClose();
        //   router.push(`/article/${id}`);
        // }}
        role={"button"}
      >
        <span
          className="text-lg font-black first-letter:uppercase 
          group-hover:underline sm:text-xl"
        >
          {val + " " + val}
        </span>
        {/* <div className="inline-flex justify-between"> */}
        <span className="text-base sm:text-lg">
          {"Kevin Kronk"}
        </span>
        <div className="flex flex-1 flex-wrap gap-x-2 text-sm sm:text-base">
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
}

export default MainSearchSuggestionItem;
