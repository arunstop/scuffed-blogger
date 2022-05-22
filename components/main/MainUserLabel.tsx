import Link from "next/link";
import React from "react";

function MainUserLabel({ id }: { id: string }) {
  return (
    <Link href={`/blogger/${id}`} passHref>
    <a className="flex flex-row items-center gap-4 hover:underline">
      <div className="avatar">
        <div
          className="w-10 rounded-lg ring-1 ring-base-content 
          group-hover:rounded-[50%] sm:w-12 sm:ring-2 z-0 transition-all"
        >
          <img src={`https://api.lorem.space/image/face?hash=${id}`} />
        </div>
      </div>
      <div className="flex flex-col">
      <span className="text-base font-bold sm:text-lg !leading-[1.2]">
        Firstname Lastn
      </span>
      <span className="text-base font-semibold sm:text-lg opacity-50 !leading-[1.2]">
        @FirstnameLastname
      </span>
      </div>
    </a>
    </Link>
  );
}

export default MainUserLabel;
