import React from "react";

function MainSectionSkeleton({ text = "Loading" }: { text?: string }) {
  return <p className="mx-auto text-lg sm:text-xl font-bold">{text}</p>;
}

export default MainSectionSkeleton;
