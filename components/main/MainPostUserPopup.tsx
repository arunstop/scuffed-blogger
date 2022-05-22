import React from "react";
import MainUserLabel from "./MainUserLabel";

function MainUserPopup({ id }: { id: string }) {
  return (
    <div className="rounded-xl p-4 flex flex-col bg-base-100 shadow-lg w-96 gap-4 ring-2 ring-base-content/20">
      <MainUserLabel id={id} />
      <div className="">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad accusamus
        aperiam deleniti ab vero veniam at fugiat adipisci
      </div>
      <div className="inline-flex justify-between items-center">
        <div className="inline-flex gap-2 text-sm">
          <span>199 posts</span>
          <span className="font-black">&middot;</span>
          <span>24K followers</span>
        </div>
        <button className="btn btn-sm btn-outline normal-case">Follow</button>
      </div>
    </div>
  );
}

export default MainUserPopup;
