import Link from "next/link";
import React from "react";
import UserAvatar from "../user/UserAvatar";

function MainUserLabel({ id }: { id: string }) {
  return (
    <Link href={`/author/${id}`} passHref>
      <a className="flex flex-row items-center gap-4 hover:underline">
        <UserAvatar id={id} />
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
